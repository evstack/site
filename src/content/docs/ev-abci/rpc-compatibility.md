---
title: "RPC Compatibility"
---

# RPC Compatibility

ev-abci provides CometBFT-compatible RPC endpoints for client compatibility.

## Overview

Existing Cosmos SDK clients expect CometBFT RPC endpoints. ev-abci implements these endpoints so tools like:

- Cosmos SDK CLI
- Keplr wallet
- CosmJS
- Block explorers

continue to work without modification.

## Supported Endpoints

### Query Methods

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/abci_query` | ✓ | Full support |
| `/block` | ✓ | Full support |
| `/block_by_hash` | ✓ | Full support |
| `/block_results` | ✓ | Full support |
| `/blockchain` | ✓ | Full support |
| `/commit` | ✓ | Full support |
| `/consensus_params` | ✓ | Full support |
| `/genesis` | ✓ | Full support |
| `/health` | ✓ | Full support |
| `/status` | ✓ | Full support |
| `/tx` | ✓ | Full support |
| `/tx_search` | ✓ | Full support |
| `/validators` | ✓ | Returns sequencer |

### Transaction Methods

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/broadcast_tx_async` | ✓ | Full support |
| `/broadcast_tx_sync` | ✓ | Full support |
| `/broadcast_tx_commit` | ✓ | Waits for inclusion |
| `/check_tx` | ✓ | Full support |

### Subscription Methods

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/subscribe` | ✓ | WebSocket events |
| `/unsubscribe` | ✓ | Full support |
| `/unsubscribe_all` | ✓ | Full support |

## Unsupported Endpoints

| Endpoint | Reason |
|----------|--------|
| `/consensus_state` | No BFT consensus |
| `/dump_consensus_state` | No BFT consensus |
| `/net_info` | Different P2P model |
| `/num_unconfirmed_txs` | Different mempool |
| `/unconfirmed_txs` | Different mempool |

## Behavioral Differences

### Validators

`/validators` returns the single sequencer rather than a validator set:

```json
{
  "validators": [
    {
      "address": "...",
      "voting_power": "1",
      "proposer_priority": "0"
    }
  ],
  "count": "1",
  "total": "1"
}
```

### Commit

`/commit` returns a simplified commit structure since there's no BFT voting:

```json
{
  "signed_header": {
    "header": { ... },
    "commit": {
      "height": "100",
      "signatures": [
        {
          "validator_address": "...",
          "signature": "..."
        }
      ]
    }
  }
}
```

### Block Time

Block timestamps reflect actual production time, which may be faster than CometBFT's typical 6s blocks.

## Port Configuration

Default ports match CometBFT:

| Port | Purpose |
|------|---------|
| 26657 | RPC |
| 26656 | P2P |

Configure via flags:

```bash
--evnode.rpc.address tcp://0.0.0.0:26657
--evnode.p2p.listen /ip4/0.0.0.0/tcp/26656
```

## Client Configuration

No client changes needed. Point clients at the same RPC URL:

```javascript
// CosmJS
const client = await StargateClient.connect("http://localhost:26657");
```

```bash
# CLI
appd config node tcp://localhost:26657
```
