# TRICE Project Page

This repository contains the project homepage for:

**Teaching Thinking Models to Reason with Tools: A Full-Pipeline Recipe for Tool-Integrated Reasoning**

Links currently used by the page:

- Paper: https://arxiv.org/abs/2605.06326
- PDF: https://arxiv.org/pdf/2605.06326.pdf
- Model: https://huggingface.co/CajZella/TRICE-4B
- Data: https://huggingface.co/datasets/CajZella/TRICE-SFT-Data

## Local Preview

Because this is a static GitHub Pages site, you can preview it by opening `index.html` directly in a browser.

If you prefer a local server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## GitHub Pages Deployment

1. Push this directory to a GitHub repository, for example `trice-homepage`.
2. Go to `Settings > Pages`.
3. Set `Source` to `Deploy from a branch`.
4. Select the branch, usually `main` or `master`, and the root directory `/`.
5. Save. GitHub will publish the page after a short build.

## Content To Update Later

- Replace `static/images/favicon.ico`.
- Add a `1200x630` social preview image at `static/images/social_preview.png`.
- Add TRICE-30B link when it is released.
- Add a code link later if a public repository is released.
- If paper figures are exported as PNG or SVG, place them under `static/images/` and add them to the method or results sections.

## Template Attribution

This page is built from the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template), which was adopted from the [Nerfies](https://nerfies.github.io/) project page.

The website template is licensed under [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
