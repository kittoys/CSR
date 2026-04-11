# UI Token Migration Checklist

## Scope

Files requested in this wave:

- `frontend/src/pages/Programs.css`
- `frontend/src/pages/ProgramDetail.css`
- `frontend/src/components/ProposalModal.css`

## Measurement Rule

- Baseline count: number of hardcoded color literals found during the audit (`#hex`, `rgb(...)`, `rgba(...)` with numeric channel values).
- Completion formula: `(replaced / baseline) * 100%`.

## Progress by File

| File                                        | Baseline Hardcoded Colors | Replaced | Remaining | Completion |
| ------------------------------------------- | ------------------------: | -------: | --------: | ---------: |
| `frontend/src/pages/Programs.css`           |                         8 |        8 |         0 |       100% |
| `frontend/src/pages/ProgramDetail.css`      |                         5 |        5 |         0 |       100% |
| `frontend/src/components/ProposalModal.css` |                        28 |       28 |         0 |       100% |

## Notes

- All three files now use semantic tokens (`--color-*`) and tokenized RGBA channels (`rgba(var(--color-*-rgb), alpha)`).
- Added `--color-on-primary-rgb` in `frontend/src/index.css` to remove remaining literal white overlay values in hero/header contexts.
- Re-validation query found no remaining hardcoded color literals in the three scoped files.
