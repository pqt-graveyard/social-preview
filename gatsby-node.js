exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /html2canvas/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}