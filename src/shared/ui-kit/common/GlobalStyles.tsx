import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: "Agrandir";
    src: local("Agrandir"),
      url("assets/fonts/Agrandir/Agrandir Variable.ttf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir GrandLight";
    src: local("Agrandir GrandLight"),
      url("assets/fonts/Agrandir/Agrandir-GrandLight.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir WideBlackItalic";
    src: local("Agrandir WideBlackItalic"),
      url("assets/fonts/Agrandir/Agrandir-WideBlackItalic.otf") format("truetype");
  }

  body, * {
    font-family: "Agrandir", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
