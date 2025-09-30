(TeX-add-style-hook
 "about_itg"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("babel" "american") ("inputenc" "utf8") ("fontenc" "T1") ("appendix" "toc" "page") ("ulem" "normalem") ("xcolor" "hyperref" "x11names") ("pdfpages" "final") ("textpos" "absolute") ("biblatex" "style=ieee" "isbn=true" "url=true" "backend=biber" "natbib=true") ("csquotes" "autostyle=true") ("hyperref" "colorlinks=true" "breaklinks=false" "hyperfigures=false" "filebordercolor=white" "filecolor=cyan" "linkbordercolor=white" "linkcolor=SteelBlue4" "urlbordercolor=white" "urlcolor=SteelBlue4" "citecolor=SteelBlue4" "menubordercolor=white" "menucolor=red" "linktocpage=false" "frenchlinks=false" "pdfdisplaydoctitle=true" "unicode") ("cantarell" "default")))
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperref")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperimage")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperbaseurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "nolinkurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "url")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "path")
   (add-to-list 'LaTeX-verbatim-macros-with-delims-local "path")
   (TeX-run-style-hooks
    "latex2e"
    "scrreprt"
    "scrreprt10"
    "babel"
    "inputenc"
    "fontenc"
    "scrlayer-scrpage"
    "setspace"
    "appendix"
    "graphicx"
    "grffile"
    "tabularx"
    "tabu"
    "longtable"
    "wrapfig"
    "rotating"
    "ulem"
    "amsmath"
    "textcomp"
    "amssymb"
    "capt-of"
    "xcolor"
    "url"
    "blindtext"
    "pdflscape"
    "pdfpages"
    "anyfontsize"
    "wallpaper"
    "textpos"
    "smartdiagram"
    "caption"
    "paralist"
    "enumitem"
    "geometry"
    "microtype"
    "chngcntr"
    "biblatex"
    "csquotes"
    "hyperref"
    "cantarell")
   (TeX-add-symbols
    "BackgroundPic"
    "BackgroundPicWordmark"
    "BackgroundPicLogo")
   (LaTeX-add-labels
    "sec:org8ddccab"
    "sec:org6a6a1cd"
    "sec:org8ef6684"
    "sec:orge30bf9f"
    "sec:org18a48f2")
   (LaTeX-add-environments
    "sidebar")
   (LaTeX-add-bibliographies
    "references")
   (LaTeX-add-lengths
    "mydepth"
    "myheight")
   (LaTeX-add-saveboxes
    "mybox")
   (LaTeX-add-xcolor-definecolors
    "headings"
    "darkgrey"
    "niceblue"
    "lnu"
    "sunflower"
    "emerald"
    "headerbg"
    "alertcolor"
    "thingray"
    "gray70")
   (LaTeX-add-caption-DeclareCaptions
    '("\\DeclareCaptionLabelSeparator{myseparator}" "LabelSeparator" "myseparator")))
 :latex)

