---
title: "How to reset the state of your chain"
---

# How to reset the state of your chain

This guide will walk you through how you reset the state of your chain.

:::warning[Disclaimer]
By definition, resetting the state is deleting your chain's data. Make sure you understand the implications of this prior to completing this guide.
:::

Some reason you might need to reset the state of your chain are:

- During testing and development
- During upgrades with breaking changes
- Hardforks

## Prerequisites

In order to complete this guide, you will need to have completed either the [quick start tutorial](./quick-start.md) or the [build our chain tutorial](./gm-world.md).

## Quick Start

When you run your chain with `testapp start` you will create a `.testapp` directory in your root directory.

This directory will look like the following.

```bash
tree $HOME/.testapp

├── config
│   ├── genesis.json
│   ├── node_key.json
│   ├── evnode.yml
│   └── signer.json
└── data
    ├── cache
    │   ├── data
    │   │   ├── da_included.gob
    │   │   ├── hashes.gob
    │   │   ├── items_by_hash.gob
    │   │   └── items_by_height.gob
    │   └── header
    │       ├── da_included.gob
    │       ├── hashes.gob
    │       ├── items_by_hash.gob
    │       └── items_by_height.gob
    ├── executor
    │   ├── 000001.sst
    │   ├── 000002.vlog
    │   ├── 000003.vlog
    │   ├── 00003.mem
    │   ├── DISCARD
    │   ├── KEYREGISTRY
    │   ├── LOCK
    │   └── MANIFEST
    └── testapp
        ├── 000001.sst
        ├── 000002.sst
        ├── 000002.vlog
        ├── 000003.sst
        ├── 000003.vlog
        ├── DISCARD
        ├── KEYREGISTRY
        └── MANIFEST
```

To reset the state of the chain, delete the content of the `data` directory.

Alternatively, you can use this command.

```bash
testapp unsafe-clean
```

When you launch your chain again with `testapp start` your `data` directory will be re-populated and you will see your chain starting at block height 1 again.

## gm-world

When you ran your gm-world chain in the [build your chain tutorial](./gm-world.md), it created a `.gm` directory in your `$HOME` directory.

This directory will look like the following:

```bash
tree $HOME/.gm

├── config
│   ├── app.toml
│   ├── client.toml
│   ├── config.toml
│   ├── genesis.json
│   ├── gentx
│   │   └── gentx-418077c64f0cf5824c24487c9cce38241de677cd.json
│   ├── node_key.json
│   ├── priv_validator_key.json
│   └── evnode.yml
├── data
│   ├── application.db
│   │   ├── 000001.log
│   │   ├── CURRENT
│   │   ├── LOCK
│   │   ├── LOG
│   │   └── MANIFEST-000000
│   ├── cache
│   │   ├── data
│   │   │   ├── da_included.gob
│   │   │   ├── hashes.gob
│   │   │   ├── items_by_hash.gob
│   │   │   └── items_by_height.gob
│   │   └── header
│   │       ├── da_included.gob
│   │       ├── hashes.gob
│   │       ├── items_by_hash.gob
│   │       └── items_by_height.gob
│   ├── priv_validator_state.json
│   ├── evolve
│   │   ├── 000001.sst
│   │   ├── 000001.vlog
│   │   ├── DISCARD
│   │   ├── KEYREGISTRY
│   │   └── MANIFEST
│   ├── snapshots
│   │   └── metadata.db
│   │       ├── 000001.log
│   │       ├── CURRENT
│   │       ├── LOCK
│   │       ├── LOG
│   │       └── MANIFEST-000000
│   └── tx_index.db
│       ├── 000001.log
│       ├── CURRENT
│       ├── LOCK
│       ├── LOG
│       └── MANIFEST-000000
└── keyring-test
    ├── 87af99a184613860ee9563be57a9fb4e7b25acb8.address
    ├── alice.info
    ├── bob.info
    └── e24d9eeca2d24193bdd98ed9116ff70f8a2e2b5e.address
```

The directories you need to delete to reset your state are in the `data` directory.

Alternatively, you can run the following command to delete the data directories:

```bash
gmd comet unsafe-reset-all
```

When you launch your chain again with your `gmd start <flags>` command, these data directories will be re-created and you will see your chain starting at block height 1 again.
