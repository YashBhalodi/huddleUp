import { spreadInCircle } from "./spreadCircularly.js";

const icon =
  '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>';

miro.onReady(() => {
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: "Huddle Up",
        tooltip: "Spread widgets in circle",
        svgIcon: icon,
        toolbarSvgIcon: icon,
        librarySvgIcon: icon,
        onClick: async () => {
          const authorized = await miro.isAuthorized();
          if (authorized) {
            spreadInCircle();
          } else {
            miro.board.ui.openModal("not-authorized.html").then((res) => {
              if (res === "success") {
                spreadInCircle();
              }
            });
          }
        },
      },
    },
  });
});
