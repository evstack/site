'use client'

import { useState, useMemo, useCallback } from 'react'

/* ===== CONSTANTS ===== */
const HEADER_BYTES = 175
const FIRST_TX_SURCHARGE = 10_000
const SECONDS_PER_MONTH = 30 * 24 * 60 * 60
const SECONDS_PER_YEAR = 365 * 24 * 60 * 60
const DATA_CHUNK_BYTES = 500 * 1024 // 500 KiB chunk limit per blob
const MAX_BLOB_SIZE = 7 * 1024 * 1024 // 7 MB max blob size (from common/consts.go)

const GAS_PARAMS = Object.freeze({
  fixedCost: 65_000,
  gasPerBlobByte: 8,
  perBlobStaticGas: 0,
  shareSizeBytes: 482
})

/* ===== TYPES ===== */
type BatchingStrategy = 'immediate' | 'size' | 'time' | 'adaptive'
type ExecutionEnv = 'evm' | 'cosmos'

type EvmTxType = {
  id: string
  label: string
  bytes: number
  description?: string
  defaultWeight: number
}

type EvmMixEntry = EvmTxType & {
  enabled: boolean
  weight: number
  color: string
}

/* ===== DATA ===== */
const EVM_TX_TYPES: EvmTxType[] = [
  { id: 'native-transfer', label: 'Native value transfer', bytes: 0, defaultWeight: 2 },
  { id: 'erc20-transfer', label: 'ERC-20 transfer', bytes: 68, defaultWeight: 5 },
  { id: 'erc20-approve', label: 'ERC-20 approve', bytes: 68, defaultWeight: 3 },
  { id: 'erc20-transferFrom', label: 'ERC-20 transferFrom', bytes: 100, defaultWeight: 2 },
  { id: 'erc721-transferFrom', label: 'ERC-721 transferFrom', bytes: 100, defaultWeight: 1 },
  {
    id: 'erc721-safeTransferFrom',
    label: 'ERC-721 safeTransferFrom',
    bytes: 164,
    defaultWeight: 1
  },
  { id: 'erc721-mint', label: 'ERC-721 mint', bytes: 68, defaultWeight: 1 },
  { id: 'erc1155-transfer', label: 'ERC-1155 safeTransferFrom', bytes: 196, defaultWeight: 1 },
  { id: 'erc1155-batch', label: 'ERC-1155 safeBatchTransferFrom', bytes: 228, defaultWeight: 1 },
  { id: 'permit', label: 'EIP-2612 permit', bytes: 228, defaultWeight: 1 }
]

const COLOR_PALETTE = [
  '#4263eb',
  '#f76707',
  '#0ca678',
  '#a61e4d',
  '#1098ad',
  '#5f3dc4',
  '#2d6a4f',
  '#ff922b',
  '#9c36b5',
  '#ffa94d'
]

function buildInitialMix(): EvmMixEntry[] {
  return EVM_TX_TYPES.map((type, index) => ({
    ...type,
    enabled: type.defaultWeight > 0,
    weight: type.defaultWeight,
    color: COLOR_PALETTE[index % COLOR_PALETTE.length]
  }))
}

/* ===== HELPERS ===== */
function sanitizeNumber(value: number): number {
  if (!isFinite(value) || value < 0) return 0
  return value
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  if (!isFinite(value)) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits
  }).format(value)
}

function formatInteger(value: number) {
  if (!isFinite(value)) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(value))
}

/* ===== COMPONENT ===== */
export function CelestiaGasEstimator() {
  /* --- State --- */
  const [executionEnv, setExecutionEnv] = useState<ExecutionEnv>('evm')
  const [evmMix, setEvmMix] = useState<EvmMixEntry[]>(buildInitialMix)
  const [batchingStrategy, setBatchingStrategy] = useState<BatchingStrategy>('time')
  const [daBlockTimeSeconds, setDaBlockTimeSeconds] = useState(6)
  const [batchSizeThresholdPercent, setBatchSizeThresholdPercent] = useState(80)
  const [batchMaxDelaySeconds, setBatchMaxDelaySeconds] = useState(0)
  const [batchMinItems, setBatchMinItems] = useState(1)
  const [blockTime, setBlockTime] = useState(0.25)
  const [blockTimeUnit, setBlockTimeUnit] = useState<'s' | 'ms'>('s')
  const [firstTx, setFirstTx] = useState(false)
  const [gasPriceValue, setGasPriceValue] = useState(0.004)
  const [txPerSecond, setTxPerSecond] = useState(10)

  /* --- Derived: internal threshold 0.0-1.0 --- */
  const batchSizeThreshold = useMemo(
    () => Math.max(10, Math.min(100, batchSizeThresholdPercent)) / 100,
    [batchSizeThresholdPercent]
  )

  /* --- Derived: tx per month (two-way sync) --- */
  const txPerMonth = useMemo(() => txPerSecond * SECONDS_PER_MONTH, [txPerSecond])

  const handleTxPerSecondChange = useCallback((v: number) => {
    setTxPerSecond(sanitizeNumber(v))
  }, [])

  const handleTxPerMonthChange = useCallback((v: number) => {
    setTxPerSecond(sanitizeNumber(v) / SECONDS_PER_MONTH)
  }, [])

  /* --- Block time in seconds --- */
  const blockTimeSeconds = useMemo(() => {
    if (!isFinite(blockTime) || blockTime <= 0) return NaN
    return blockTimeUnit === 'ms' ? blockTime / 1000 : blockTime
  }, [blockTime, blockTimeUnit])

  const blocksPerSecond = useMemo(() => {
    if (!isFinite(blockTimeSeconds) || blockTimeSeconds <= 0) return 0
    return 1 / blockTimeSeconds
  }, [blockTimeSeconds])

  /* --- Effective max delay --- */
  const effectiveMaxDelaySeconds = useMemo(
    () => (batchMaxDelaySeconds <= 0 ? daBlockTimeSeconds : batchMaxDelaySeconds),
    [batchMaxDelaySeconds, daBlockTimeSeconds]
  )

  /* --- Target bytes for size-based batching --- */
  const targetBlobBytes = useMemo(() => MAX_BLOB_SIZE * batchSizeThreshold, [batchSizeThreshold])

  /* ===== HEADER SUBMISSION INTERVAL ===== */
  const headerSubmissionIntervalSeconds = useMemo(() => {
    const bs = blockTimeSeconds
    if (!isFinite(bs) || bs <= 0) return NaN
    const minItems = Math.max(1, batchMinItems)
    const headerBytesPerBlock = HEADER_BYTES

    if (batchingStrategy === 'immediate') return bs * minItems

    if (batchingStrategy === 'time') {
      const delayBlocks = Math.ceil(effectiveMaxDelaySeconds / bs)
      return bs * Math.max(minItems, delayBlocks)
    }

    if (batchingStrategy === 'size') {
      const blocksToThreshold = Math.ceil(targetBlobBytes / headerBytesPerBlock)
      return bs * Math.max(minItems, blocksToThreshold)
    }

    if (batchingStrategy === 'adaptive') {
      const delayBlocks = Math.ceil(effectiveMaxDelaySeconds / bs)
      const blocksToThreshold = Math.ceil(targetBlobBytes / headerBytesPerBlock)
      return bs * Math.min(Math.max(minItems, delayBlocks), Math.max(minItems, blocksToThreshold))
    }

    return bs * minItems
  }, [blockTimeSeconds, batchMinItems, batchingStrategy, effectiveMaxDelaySeconds, targetBlobBytes])

  /* --- Header count from submission interval --- */
  const normalizedHeaderCount = useMemo(() => {
    const bs = blockTimeSeconds
    const interval = headerSubmissionIntervalSeconds
    if (!isFinite(bs) || bs <= 0 || !isFinite(interval)) return 1
    return Math.max(1, Math.round(interval / bs))
  }, [blockTimeSeconds, headerSubmissionIntervalSeconds])

  const headerBytesTotal = useMemo(
    () => normalizedHeaderCount * HEADER_BYTES,
    [normalizedHeaderCount]
  )

  const headerSubmissionsPerSecond = useMemo(() => {
    const interval = headerSubmissionIntervalSeconds
    if (!isFinite(interval) || interval <= 0) return 0
    return 1 / interval
  }, [headerSubmissionIntervalSeconds])

  const headerSubmissionsPerYear = useMemo(
    () => headerSubmissionsPerSecond * SECONDS_PER_YEAR,
    [headerSubmissionsPerSecond]
  )

  const headerShares = useMemo(() => {
    const shareSize = Math.max(GAS_PARAMS.shareSizeBytes, 1)
    return Math.max(1, Math.ceil(headerBytesTotal / shareSize))
  }, [headerBytesTotal])

  const headerGas = useMemo(() => {
    const shareSize = Math.max(GAS_PARAMS.shareSizeBytes, 1)
    const gasPerByte = Math.max(GAS_PARAMS.gasPerBlobByte, 0)
    return Math.round(headerShares * shareSize * gasPerByte)
  }, [headerShares])

  /* ===== MIX COMPUTATIONS ===== */
  const enabledMix = useMemo(() => evmMix.filter((e) => e.enabled && e.weight > 0), [evmMix])

  const totalMixWeight = useMemo(
    () => enabledMix.reduce((sum, e) => sum + e.weight, 0),
    [enabledMix]
  )

  const mixSlices = useMemo(() => {
    if (totalMixWeight === 0) return []
    return enabledMix.map((entry) => ({
      id: entry.id,
      label: entry.label,
      bytes: entry.bytes,
      percentage: (entry.weight / totalMixWeight) * 100,
      color: entry.color
    }))
  }, [enabledMix, totalMixWeight])

  const mixSegments = useMemo(() => {
    if (!mixSlices.length) return []
    const total = mixSlices.reduce((sum, s) => sum + s.percentage, 0)
    if (total === 0) return []
    let cumulative = 0
    return mixSlices.map((slice) => {
      const value = (slice.percentage / total) * 100
      const dashArray = `${value} ${100 - value}`
      const dashOffset = 25 - cumulative
      cumulative += value
      return { ...slice, dashArray, dashOffset }
    })
  }, [mixSlices])

  const averageCalldataBytes = useMemo(() => {
    if (executionEnv !== 'evm') return 0
    if (totalMixWeight === 0) return 0
    return enabledMix.reduce((sum, e) => sum + (e.weight / totalMixWeight) * e.bytes, 0) || 0
  }, [executionEnv, enabledMix, totalMixWeight])

  const txPerYear = useMemo(() => txPerSecond * SECONDS_PER_YEAR, [txPerSecond])

  /* ===== DATA BYTES PER SECOND ===== */
  const dataBytesPerSecond = useMemo(() => {
    if (executionEnv !== 'evm') return 0
    return txPerSecond * averageCalldataBytes
  }, [executionEnv, txPerSecond, averageCalldataBytes])

  /* ===== DATA SUBMISSION INTERVAL ===== */
  const dataSubmissionIntervalSeconds = useMemo(() => {
    const bs = blockTimeSeconds
    const bytesPerSecond = dataBytesPerSecond

    if (!isFinite(bs) || bs <= 0) return NaN

    // If no data throughput, fall back to header interval
    if (bytesPerSecond <= 0) return headerSubmissionIntervalSeconds

    const minItems = Math.max(1, batchMinItems)
    const minInterval = bs * minItems

    if (batchingStrategy === 'immediate') return minInterval

    if (batchingStrategy === 'time') {
      return Math.max(minInterval, effectiveMaxDelaySeconds)
    }

    if (batchingStrategy === 'size') {
      const timeToThreshold = targetBlobBytes / bytesPerSecond
      return Math.max(minInterval, timeToThreshold)
    }

    if (batchingStrategy === 'adaptive') {
      const timeToThreshold = targetBlobBytes / bytesPerSecond
      return Math.max(minInterval, Math.min(timeToThreshold, effectiveMaxDelaySeconds))
    }

    return minInterval
  }, [
    blockTimeSeconds,
    dataBytesPerSecond,
    headerSubmissionIntervalSeconds,
    batchMinItems,
    batchingStrategy,
    effectiveMaxDelaySeconds,
    targetBlobBytes
  ])

  const dataSubmissionsPerSecond = useMemo(() => {
    const interval = dataSubmissionIntervalSeconds
    if (!isFinite(interval) || interval <= 0) return 0
    return 1 / interval
  }, [dataSubmissionIntervalSeconds])

  const dataSubmissionsPerYear = useMemo(
    () => dataSubmissionsPerSecond * SECONDS_PER_YEAR,
    [dataSubmissionsPerSecond]
  )

  const transactionsPerSubmission = useMemo(() => {
    const interval = dataSubmissionIntervalSeconds
    if (!isFinite(interval) || interval <= 0) return 0
    return txPerSecond * interval
  }, [dataSubmissionIntervalSeconds, txPerSecond])

  const dataBytesPerSubmission = useMemo(() => {
    if (executionEnv !== 'evm') return 0
    return averageCalldataBytes * transactionsPerSubmission
  }, [executionEnv, averageCalldataBytes, transactionsPerSubmission])

  const dataChunks = useMemo(() => {
    if (executionEnv !== 'evm' || dataBytesPerSubmission <= 0) {
      return [] as Array<{ bytes: number; shares: number; gas: number }>
    }
    const shareSize = Math.max(GAS_PARAMS.shareSizeBytes, 1)
    const gasPerByte = Math.max(GAS_PARAMS.gasPerBlobByte, 0)
    const chunks: Array<{ bytes: number; shares: number; gas: number }> = []
    let remaining = dataBytesPerSubmission
    while (remaining > 0) {
      const bytes = Math.min(DATA_CHUNK_BYTES, remaining)
      const shares = Math.max(1, Math.ceil(bytes / shareSize))
      const gas = shares * shareSize * gasPerByte
      chunks.push({ bytes, shares, gas })
      remaining -= bytes
    }
    return chunks
  }, [executionEnv, dataBytesPerSubmission])

  const dataBlobCount = useMemo(() => dataChunks.length, [dataChunks])

  const dataSharesPerSubmission = useMemo(
    () => dataChunks.reduce((sum, c) => sum + c.shares, 0),
    [dataChunks]
  )

  const dataGasPerSubmission = useMemo(
    () => dataChunks.reduce((sum, c) => sum + c.gas, 0),
    [dataChunks]
  )

  const dataStaticGasPerSubmission = useMemo(
    () => dataBlobCount * Math.max(GAS_PARAMS.perBlobStaticGas, 0),
    [dataBlobCount]
  )

  const averageDataBlobBytes = useMemo(() => {
    if (dataBlobCount === 0) return 0
    return dataBytesPerSubmission / dataBlobCount
  }, [dataBytesPerSubmission, dataBlobCount])

  /* ===== GAS PRICE ===== */
  const gasPriceUTIA = useMemo(() => Math.max(gasPriceValue, 0), [gasPriceValue])
  const gasPriceTIA = useMemo(() => gasPriceUTIA / 1_000_000, [gasPriceUTIA])

  /* ===== HEADER COSTS ===== */
  const headerFixedGasPerSubmission = GAS_PARAMS.fixedCost

  const headerFeePerSubmissionTIA = useMemo(
    () => (headerGas + headerFixedGasPerSubmission) * gasPriceTIA,
    [headerGas, headerFixedGasPerSubmission, gasPriceTIA]
  )

  const headerFeePerYearTIA = useMemo(
    () => headerFeePerSubmissionTIA * headerSubmissionsPerYear,
    [headerFeePerSubmissionTIA, headerSubmissionsPerYear]
  )

  /* ===== DATA COSTS ===== */
  const dataFixedGasPerSubmission = useMemo(
    () => dataBlobCount * GAS_PARAMS.fixedCost,
    [dataBlobCount]
  )

  const dataRecurringGasPerSubmission = useMemo(
    () => dataGasPerSubmission + dataStaticGasPerSubmission + dataFixedGasPerSubmission,
    [dataGasPerSubmission, dataStaticGasPerSubmission, dataFixedGasPerSubmission]
  )

  const dataFeePerSubmissionTIA = useMemo(
    () => dataRecurringGasPerSubmission * gasPriceTIA,
    [dataRecurringGasPerSubmission, gasPriceTIA]
  )

  const dataFeePerYearTIA = useMemo(
    () => dataFeePerSubmissionTIA * dataSubmissionsPerYear,
    [dataFeePerSubmissionTIA, dataSubmissionsPerYear]
  )

  /* ===== TOTALS ===== */
  const firstTxGas = firstTx ? FIRST_TX_SURCHARGE : 0
  const firstTxFeeTIA = useMemo(() => firstTxGas * gasPriceTIA, [firstTxGas, gasPriceTIA])

  const fixedFeePerYearTIA = useMemo(
    () =>
      (headerFixedGasPerSubmission * headerSubmissionsPerYear +
        dataFixedGasPerSubmission * dataSubmissionsPerYear) *
      gasPriceTIA,
    [
      headerFixedGasPerSubmission,
      headerSubmissionsPerYear,
      dataFixedGasPerSubmission,
      dataSubmissionsPerYear,
      gasPriceTIA
    ]
  )

  const totalRecurringFeePerYearTIA = useMemo(
    () => headerFeePerYearTIA + dataFeePerYearTIA,
    [headerFeePerYearTIA, dataFeePerYearTIA]
  )

  const feePerSecondTIA = useMemo(() => {
    const headerFeePerSecond = headerFeePerSubmissionTIA * headerSubmissionsPerSecond
    const dataFeePerSecond = dataFeePerSubmissionTIA * dataSubmissionsPerSecond
    return headerFeePerSecond + dataFeePerSecond
  }, [
    headerFeePerSubmissionTIA,
    headerSubmissionsPerSecond,
    dataFeePerSubmissionTIA,
    dataSubmissionsPerSecond
  ])

  /* --- Mix actions --- */
  const randomizeMix = useCallback(() => {
    setEvmMix((prev) =>
      prev.map((entry) => ({
        ...entry,
        enabled: true,
        weight: Math.max(1, Math.round(Math.random() * 100))
      }))
    )
  }, [])

  const resetMix = useCallback(() => {
    setEvmMix((prev) =>
      prev.map((entry, index) => ({
        ...entry,
        enabled: EVM_TX_TYPES[index].defaultWeight > 0,
        weight: EVM_TX_TYPES[index].defaultWeight
      }))
    )
  }, [])

  const updateMixEntry = useCallback(
    (id: string, field: 'enabled' | 'weight', value: boolean | number) => {
      setEvmMix((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
      )
    },
    []
  )

  /* ===== RENDER ===== */
  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ===== BLOCK PRODUCTION ===== */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm">
        <h3 className="mt-0 mb-4 text-lg font-semibold">Block production</h3>

        <FieldRow label="Header size (bytes)" htmlFor="header-bytes">
          <input
            id="header-bytes"
            type="number"
            value={HEADER_BYTES}
            readOnly
            className="w-full rounded-lg border border-fd-border bg-fd-muted/40 px-3 py-2 text-sm cursor-not-allowed"
          />
        </FieldRow>

        <FieldRow label="Block time" htmlFor="block-time">
          <div className="flex gap-2">
            <input
              id="block-time"
              type="number"
              min={0}
              step={0.001}
              value={blockTime}
              onChange={(e) => setBlockTime(parseFloat(e.target.value) || 0)}
              className="min-w-0 flex-1 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
            />
            <select
              value={blockTimeUnit}
              onChange={(e) => setBlockTimeUnit(e.target.value as 's' | 'ms')}
              className="min-w-[120px] rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
            >
              <option value="s">seconds</option>
              <option value="ms">milliseconds</option>
            </select>
          </div>
        </FieldRow>

        <ul className="m-0 grid list-none gap-2 p-0">
          <MetricRow label="Blocks / second" value={formatNumber(blocksPerSecond, 4)} />
        </ul>
      </section>

      {/* ===== BATCHING STRATEGY ===== */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm">
        <h3 className="mt-0 mb-4 text-lg font-semibold">Batching strategy</h3>
        <p className="mb-5 text-sm text-fd-muted-foreground">
          Controls how blocks are batched before submission to the DA layer. Different strategies
          offer trade-offs between latency, cost efficiency, and throughput.
        </p>

        <FieldRow label="Strategy" htmlFor="strategy">
          <select
            id="strategy"
            value={batchingStrategy}
            onChange={(e) => setBatchingStrategy(e.target.value as BatchingStrategy)}
            className="w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
          >
            <option value="immediate">Immediate</option>
            <option value="size">Size-based</option>
            <option value="time">Time-based</option>
            <option value="adaptive">Adaptive (Recommended)</option>
          </select>
        </FieldRow>

        <div className="my-5 rounded-lg border-l-[3px] border-fd-primary bg-fd-background px-4 py-3">
          {batchingStrategy === 'immediate' && (
            <p className="m-0 text-sm leading-relaxed">
              <strong>Immediate:</strong> Submits as soon as any blocks are available. Best for
              low-latency requirements where cost is not a concern.
            </p>
          )}
          {batchingStrategy === 'size' && (
            <p className="m-0 text-sm leading-relaxed">
              <strong>Size-based:</strong> Waits until the batch reaches a size threshold (fraction
              of max blob size). Best for maximizing blob utilization and minimizing costs when
              latency is flexible.
            </p>
          )}
          {batchingStrategy === 'time' && (
            <p className="m-0 text-sm leading-relaxed">
              <strong>Time-based:</strong> Waits for a time interval before submitting. Provides
              predictable submission timing aligned with DA block times.
            </p>
          )}
          {batchingStrategy === 'adaptive' && (
            <p className="m-0 text-sm leading-relaxed">
              <strong>Adaptive:</strong> Balances between size and time constraints—submits when
              either the size threshold is reached OR the max delay expires. Recommended for most
              production deployments.
            </p>
          )}
        </div>

        <FieldRow label="DA block time" htmlFor="da-block-time">
          <div className="flex gap-2 items-center">
            <input
              id="da-block-time"
              type="number"
              min={1}
              step={1}
              value={daBlockTimeSeconds}
              onChange={(e) => setDaBlockTimeSeconds(parseInt(e.target.value) || 1)}
              className="min-w-0 flex-1 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
            />
            <span className="text-sm text-fd-muted-foreground whitespace-nowrap">seconds</span>
          </div>
        </FieldRow>

        {(batchingStrategy === 'size' || batchingStrategy === 'adaptive') && (
          <FieldRow label="Batch size threshold (%)" htmlFor="size-threshold">
            <div className="flex gap-2 items-center">
              <input
                id="size-threshold"
                type="number"
                min={10}
                max={100}
                step={5}
                value={batchSizeThresholdPercent}
                onChange={(e) => setBatchSizeThresholdPercent(parseInt(e.target.value) || 10)}
                className="min-w-0 flex-1 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
              />
              <span className="text-sm text-fd-muted-foreground whitespace-nowrap">
                % of 7 MB max blob
              </span>
            </div>
          </FieldRow>
        )}

        {(batchingStrategy === 'time' || batchingStrategy === 'adaptive') && (
          <FieldRow label="Batch max delay" htmlFor="max-delay">
            <div className="flex gap-2 items-center">
              <input
                id="max-delay"
                type="number"
                min={0}
                step={1}
                value={batchMaxDelaySeconds}
                onChange={(e) => setBatchMaxDelaySeconds(parseInt(e.target.value) || 0)}
                className="min-w-0 flex-1 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
              />
              <span className="text-sm text-fd-muted-foreground whitespace-nowrap">
                seconds (0 = DA block time)
              </span>
            </div>
          </FieldRow>
        )}

        <FieldRow label="Batch minimum items" htmlFor="min-items">
          <input
            id="min-items"
            type="number"
            min={1}
            step={1}
            value={batchMinItems}
            onChange={(e) => setBatchMinItems(parseInt(e.target.value) || 1)}
            className="w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
          />
        </FieldRow>

        <p className="mt-4 mb-0 text-sm text-fd-muted-foreground">
          Header and data submission rates are shown in the Estimation section below, based on your
          data workload configuration.
        </p>
      </section>

      {/* ===== DATA WORKLOAD ===== */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm">
        <h3 className="mt-0 mb-4 text-lg font-semibold">Data workload</h3>

        <div className="mb-4 flex gap-4 font-semibold">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              value="evm"
              checked={executionEnv === 'evm'}
              onChange={() => setExecutionEnv('evm')}
            />
            EVM
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              value="cosmos"
              checked={executionEnv === 'cosmos'}
              onChange={() => setExecutionEnv('cosmos')}
            />
            Cosmos SDK
          </label>
        </div>

        {executionEnv === 'cosmos' ? (
          <div className="rounded-xl border border-dashed border-fd-border bg-fd-muted/30 p-4 text-sm">
            Cosmos SDK transaction size presets are coming soon. Header costs still apply; data
            costs default to zero.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Rate grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 font-semibold text-sm">
                Transactions per second
                <input
                  id="tx-tps"
                  type="number"
                  min={0}
                  step={0.01}
                  value={txPerSecond}
                  onChange={(e) => handleTxPerSecondChange(parseFloat(e.target.value) || 0)}
                  className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 font-semibold text-sm">
                Transactions per month
                <input
                  id="tx-month"
                  type="number"
                  min={0}
                  step={1}
                  value={Math.round(txPerMonth)}
                  onChange={(e) => handleTxPerMonthChange(parseFloat(e.target.value) || 0)}
                  className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm font-normal"
                />
              </label>
            </div>

            {/* Mix actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={randomizeMix}
                className="rounded-lg bg-fd-primary/15 px-3.5 py-2 text-sm font-semibold text-fd-primary transition-colors hover:bg-fd-primary hover:text-fd-primary-foreground cursor-pointer"
              >
                Randomize configuration
              </button>
              <button
                type="button"
                onClick={resetMix}
                className="rounded-lg border border-fd-border bg-transparent px-3.5 py-2 text-sm font-semibold transition-colors hover:border-fd-primary hover:text-fd-primary cursor-pointer"
              >
                Reset defaults
              </button>
            </div>

            {/* Chart + legend grid */}
            <div className="grid gap-8 md:grid-cols-[280px_1fr]">
              {/* Donut chart */}
              <div className="relative mx-auto h-[220px] w-[220px]">
                {mixSegments.length ? (
                  <>
                    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="var(--color-fd-border)"
                        strokeWidth="3.2"
                      />
                      {mixSegments.map((seg) => (
                        <circle
                          key={seg.id}
                          cx="18"
                          cy="18"
                          r="15.9155"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="3.2"
                          strokeLinecap="butt"
                          strokeDasharray={seg.dashArray}
                          strokeDashoffset={seg.dashOffset}
                        />
                      ))}
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-[130px] w-[130px] flex-col items-center justify-center gap-0.5 rounded-full bg-fd-background text-center shadow-[inset_0_0_0_1px_var(--color-fd-border)]">
                      <div className="text-xl font-bold tabular-nums">
                        {formatNumber(averageCalldataBytes, 1)}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-fd-muted-foreground">
                        bytes avg
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-fd-muted-foreground px-4">
                    Enable at least one transaction type
                  </div>
                )}
              </div>

              {/* Legend */}
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {mixSlices.map((slice) => (
                  <li key={slice.id} className="flex items-start gap-3">
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{ background: slice.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <strong className="mb-0.5 block">{slice.label}</strong>
                      <span className="text-sm text-fd-muted-foreground">
                        {formatNumber(slice.percentage, 1)}% &bull; {slice.bytes} bytes
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customize transaction mix */}
            <details className="rounded-xl border border-fd-border bg-fd-background p-4" open>
              <summary className="mb-4 cursor-pointer font-semibold">
                Customize transaction mix
              </summary>
              <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                {evmMix.map((entry) => (
                  <label
                    key={entry.id}
                    className={`flex cursor-pointer flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-4 transition-opacity ${
                      !entry.enabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <input
                        type="checkbox"
                        checked={entry.enabled}
                        onChange={(e) => updateMixEntry(entry.id, 'enabled', e.target.checked)}
                      />
                      <span>{entry.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-fd-muted-foreground">
                      <span>{entry.bytes} bytes</span>
                      <span className="h-3 w-3 rounded-full" style={{ background: entry.color }} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm">Weight</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={entry.weight}
                        disabled={!entry.enabled}
                        onChange={(e) =>
                          updateMixEntry(entry.id, 'weight', parseInt(e.target.value) || 0)
                        }
                        className="w-20 rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </details>

            {/* Metrics summary */}
            <div className="flex flex-col gap-2 rounded-xl bg-fd-primary/10 p-4">
              <MetricRow
                label="Average calldata bytes / tx"
                value={formatNumber(averageCalldataBytes, 2)}
              />
              <MetricRow
                label="Transactions / submission"
                value={formatNumber(transactionsPerSubmission, 2)}
              />
              <MetricRow label="Data blobs / submission" value={formatInteger(dataBlobCount)} />
              <MetricRow
                label="Average blob size (bytes)"
                value={formatNumber(averageDataBlobBytes, 2)}
              />
              <MetricRow
                label="Data bytes / submission"
                value={formatNumber(dataBytesPerSubmission, 2)}
              />
              <MetricRow
                label="Data shares / submission"
                value={formatInteger(dataSharesPerSubmission)}
              />
            </div>
          </div>
        )}
      </section>

      {/* ===== GAS PARAMETERS ===== */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm">
        <h3 className="mt-0 mb-4 text-lg font-semibold">Gas parameters</h3>
        <p className="mb-5 text-sm text-fd-muted-foreground">
          Locked to Celestia mainnet defaults until live parameter fetching and manual overrides
          ship.
        </p>

        <ul className="m-0 mb-6 grid list-none gap-2 p-0">
          <MetricRow label="Fixed cost" value={`${formatInteger(GAS_PARAMS.fixedCost)} gas`} />
          <MetricRow
            label="Gas per blob byte"
            value={`${formatInteger(GAS_PARAMS.gasPerBlobByte)} gas / byte`}
          />
          <MetricRow
            label="Share size"
            value={`${formatInteger(GAS_PARAMS.shareSizeBytes)} bytes`}
          />
        </ul>

        <div className="mb-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={firstTx}
              onChange={(e) => setFirstTx(e.target.checked)}
            />
            First transaction for this account (adds 10,000 gas once)
          </label>
        </div>

        <FieldRow label="Gas price (uTIA / gas)" htmlFor="gas-price">
          <input
            id="gas-price"
            type="number"
            min={0}
            step={0.001}
            value={gasPriceValue}
            onChange={(e) => setGasPriceValue(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm"
          />
        </FieldRow>
      </section>

      {/* ===== ESTIMATION ===== */}
      <section className="rounded-xl border border-fd-border bg-fd-card p-6 shadow-sm">
        <h3 className="mt-0 mb-4 text-lg font-semibold">Estimation</h3>

        {/* Summary cards */}
        <div className="mb-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <SummaryCard
            label="Total yearly fee (TIA)"
            value={formatNumber(totalRecurringFeePerYearTIA, 4)}
            highlight
          />
          <SummaryCard label="Fee / second (TIA)" value={formatNumber(feePerSecondTIA, 6)} />
          <SummaryCard
            label="Header fee / year (TIA)"
            value={formatNumber(headerFeePerYearTIA, 4)}
          />
          <SummaryCard label="Data fee / year (TIA)" value={formatNumber(dataFeePerYearTIA, 4)} />
        </div>

        {/* Header costs */}
        <details open>
          <summary className="mb-3 cursor-pointer font-semibold">Header costs</summary>
          <ul className="m-0 mb-6 grid list-none gap-2 p-0">
            <MetricRow
              label="Header submission interval (s)"
              value={formatNumber(headerSubmissionIntervalSeconds, 2)}
            />
            <MetricRow label="Headers / submission" value={formatInteger(normalizedHeaderCount)} />
            <MetricRow label="Header bytes / submission" value={formatInteger(headerBytesTotal)} />
            <MetricRow
              label="Header submissions / year"
              value={formatNumber(headerSubmissionsPerYear, 0)}
            />
            <MetricRow label="Header gas / submission" value={formatInteger(headerGas)} />
            <MetricRow
              label="Header fee / submission (TIA)"
              value={formatNumber(headerFeePerSubmissionTIA, 6)}
            />
            <MetricRow
              label="Header fee / year (TIA)"
              value={formatNumber(headerFeePerYearTIA, 4)}
            />
          </ul>
        </details>

        {/* Data costs */}
        <details open={executionEnv === 'evm'}>
          <summary className="mb-3 cursor-pointer font-semibold">Data costs</summary>
          {averageCalldataBytes === 0 ? (
            <p className="mb-6 text-sm text-fd-muted-foreground">
              Enable at least one transaction type to model calldata usage.
            </p>
          ) : (
            <ul className="m-0 mb-6 grid list-none gap-2 p-0">
              <MetricRow label="Data bytes / second" value={formatNumber(dataBytesPerSecond, 2)} />
              <MetricRow
                label="Data submission interval (s)"
                value={formatNumber(dataSubmissionIntervalSeconds, 2)}
              />
              <MetricRow
                label="Data submissions / year"
                value={formatNumber(dataSubmissionsPerYear, 0)}
              />
              <MetricRow
                label="Average calldata bytes / tx"
                value={formatNumber(averageCalldataBytes, 2)}
              />
              <MetricRow
                label="Transactions / data submission"
                value={formatNumber(transactionsPerSubmission, 0)}
              />
              <MetricRow
                label="Data bytes / submission"
                value={formatNumber(dataBytesPerSubmission, 0)}
              />
              <MetricRow label="Data blobs / submission" value={formatInteger(dataBlobCount)} />
              <MetricRow
                label="Data gas / submission"
                value={formatInteger(dataGasPerSubmission)}
              />
              <MetricRow
                label="Data fee / submission (TIA)"
                value={formatNumber(dataFeePerSubmissionTIA, 6)}
              />
              <MetricRow label="Data fee / year (TIA)" value={formatNumber(dataFeePerYearTIA, 4)} />
            </ul>
          )}
        </details>

        {/* Fixed costs (PFB base gas) */}
        <details>
          <summary className="mb-3 cursor-pointer font-semibold">
            Fixed costs (PFB base gas)
          </summary>
          <ul className="m-0 mb-6 grid list-none gap-2 p-0">
            <MetricRow
              label="Header PFB base gas"
              value={`${formatInteger(GAS_PARAMS.fixedCost)} gas`}
            />
            <MetricRow
              label="Header fixed fee / year (TIA)"
              value={formatNumber(
                headerFixedGasPerSubmission * headerSubmissionsPerYear * gasPriceTIA,
                4
              )}
            />
            <MetricRow label="Data blobs / submission" value={formatInteger(dataBlobCount)} />
            <MetricRow
              label="Data fixed fee / year (TIA)"
              value={formatNumber(
                dataFixedGasPerSubmission * dataSubmissionsPerYear * gasPriceTIA,
                4
              )}
            />
            <MetricRow
              label="Total fixed fee / year (TIA)"
              value={formatNumber(fixedFeePerYearTIA, 4)}
            />
            {firstTx && (
              <MetricRow
                label="First transaction surcharge (TIA)"
                value={formatNumber(firstTxFeeTIA, 6)}
              />
            )}
          </ul>
        </details>

        {/* Throughput metrics */}
        <details>
          <summary className="mb-3 cursor-pointer font-semibold">Throughput metrics</summary>
          <ul className="m-0 mb-6 grid list-none gap-2 p-0">
            <MetricRow label="Transactions per second" value={formatNumber(txPerSecond, 4)} />
            <MetricRow label="Transactions per year" value={formatNumber(txPerYear, 0)} />
            <MetricRow
              label="Header submissions / year"
              value={formatNumber(headerSubmissionsPerYear, 0)}
            />
            <MetricRow
              label="Data submissions / year"
              value={formatNumber(dataSubmissionsPerYear, 0)}
            />
          </ul>
        </details>
      </section>
    </div>
  )
}

/* ===== SUB-COMPONENTS ===== */

function FieldRow({
  label,
  htmlFor,
  children
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4 text-sm">
      <span>{label}</span>
      <strong className="tabular-nums">{value}</strong>
    </li>
  )
}

function SummaryCard({
  label,
  value,
  highlight = false
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-lg border p-4 ${
        highlight ? 'border-fd-primary bg-fd-primary/10' : 'border-fd-border bg-fd-background'
      }`}
    >
      <span className="text-sm text-fd-muted-foreground">{label}</span>
      <strong className={`tabular-nums ${highlight ? 'text-xl text-fd-primary' : 'text-base'}`}>
        {value}
      </strong>
    </div>
  )
}
