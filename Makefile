.PHONY: help install dev build lint format typecheck test e2e dist clean

help:
	@echo "Snapora — common tasks"
	@echo ""
	@echo "  make install     install npm deps"
	@echo "  make dev         launch app in dev mode (HMR)"
	@echo "  make lint        run ESLint"
	@echo "  make format      run Prettier (write)"
	@echo "  make typecheck   run TypeScript without emit"
	@echo "  make test        run vitest unit tests"
	@echo "  make e2e         run Playwright e2e tests (builds first)"
	@echo "  make build       production build (unsigned)"
	@echo "  make dist        package macOS DMG (signed if certs present)"
	@echo "  make clean       remove build outputs and node_modules"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

format:
	npm run format

typecheck:
	npm run typecheck

test:
	npm test

e2e: build
	npm run e2e

dist:
	npm run dist

clean:
	rm -rf node_modules out dist release coverage playwright-report test-results
