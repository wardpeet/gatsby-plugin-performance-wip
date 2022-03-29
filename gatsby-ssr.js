let pageScripts = [];
let appScripts = [];

function removePageScripts(components, pageScripts) {
  return components.filter((cmp) => {
    if (
      cmp.props.as === "script" &&
      pageScripts.includes(cmp.props.href.slice(1))
    ) {
      return false;
    }

    if (
      cmp.type === "script" &&
      cmp.props.src &&
      pageScripts.includes(cmp.props.src.slice(1))
    ) {
      return false;
    }

    if (cmp.props.as === "fetch" && !cmp.props.href.endsWith("app-data.json")) {
      return false;
    }

    return true;
  });
}

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
  replacePostBodyComponents,
  getPostBodyComponents,
}) => {
  const assetsByChunkName =
    require("/public/webpack.stats.json").assetsByChunkName;
  if (!appScripts.length || !pageScripts.length) {
    Object.keys(assetsByChunkName).forEach((key) => {
      if (key === "app" || key === "polyfill") {
        appScripts.push(...assetsByChunkName[key]);
      } else {
        pageScripts.push(...assetsByChunkName[key]);
      }
    });
  }

  replaceHeadComponents(
    removePageScripts(getHeadComponents(), [...pageScripts, ...appScripts])
  );
  replacePostBodyComponents(
    removePageScripts(getPostBodyComponents(), pageScripts)
  );
};
