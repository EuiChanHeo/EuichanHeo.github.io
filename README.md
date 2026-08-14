# euichanheo.github.io

Personal site built on [al-folio](https://github.com/alshedivat/al-folio) (Jekyll).

## Local development

```bash
bundle install
bundle exec jekyll serve
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to the `gh-pages` branch. In the repo's **Settings → Pages**, set the source to "Deploy from a branch" → `gh-pages`.
