import React from "react";

export const ArrowIcon = ({ color = "white" }) => (
  <svg width="57" height="15" viewBox="0 0 57 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.29892 0.85612L7.15468 0.716853L7.01577 0.861441L0.855773 7.27344L0.72266 7.412L0.855773 7.55056L7.01577 13.9626L7.15218 14.1045L7.29628 13.9704L8.10828 13.2144L8.25661 13.0763L8.11656 12.9298L3.56791 8.172H55.756H55.956V7.972V6.852V6.652H55.756H3.56969L8.11618 1.92261L8.25449 1.77874L8.11092 1.64012L7.29892 0.85612Z"
      fill={color}
      stroke={color}
      strokeWidth="0.4"
    />
  </svg>
);

export const RectangleCheckedIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="22" height="22" rx="5" fill="#65CB63" />
    <path
      d="M7 11.6L9.28571 14L15 8"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RectangleUncheckedIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="22" height="22" rx="5" fill="#65CB63" />
  </svg>
);

export const RectangleUncheckedStrokeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="22" height="22" rx="5" stroke="#A19FFF" />
  </svg>
);

export const TimerIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 8.5C17 13.1944 13.1944 17 8.5 17C3.80558 17 0 13.1944 0 8.5C0 3.80558 3.80558 0 8.5 0C13.1944 0 17 3.80558 17 8.5Z"
      fill="#65CB63"
    />
    <path
      d="M8 4V8.375L11 11"
      stroke="#17172D"
      strokeWidth="2.06786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DiscussionIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.1251 4.56213H9.37556C8.31262 4.56213 7.50049 5.37427 7.50049 6.43721V11.4378C7.50049 12.4374 8.31262 13.3129 9.37556 13.3129H15.6254L18.1251 15.8126V13.3129C19.1881 13.3129 20.0002 12.4374 20.0002 11.4378V6.43721C20.0002 5.37544 19.1881 4.56213 18.1251 4.56213Z"
      fill="white"
    />
    <path
      d="M10.6246 0.187378H1.87507C0.812132 0.187378 0 0.99951 0 2.06245V7.06305C0 8.06269 0.812132 8.93813 1.87507 8.93813V11.4378L4.37477 8.93813H6.24985V6.43843C6.24985 4.68876 7.6245 3.3129 9.37537 3.3129H12.5009V2.06245C12.4997 0.99951 11.6876 0.187378 10.6247 0.187378H10.6246Z"
      fill="white"
    />
  </svg>
);

export const DiscussionOneIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.1251 4.56213H9.37556C8.31262 4.56213 7.50049 5.37427 7.50049 6.43721V11.4378C7.50049 12.4374 8.31262 13.3129 9.37556 13.3129H15.6254L18.1251 15.8126V13.3129C19.1881 13.3129 20.0002 12.4374 20.0002 11.4378V6.43721C20.0002 5.37544 19.1881 4.56213 18.1251 4.56213Z"
      fill="#65CB63"
    />
  </svg>
);

export const DownArrowIcon = ({ color = "white" }) => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.86914 5.77441C4.95508 5.77441 5.03613 5.75879 5.1123 5.72754C5.18848 5.69629 5.25586 5.64551 5.31445 5.5752L9.56836 1.22754C9.68555 1.11426 9.74414 0.977539 9.74414 0.817383C9.74414 0.708008 9.71777 0.608398 9.66504 0.518555C9.6123 0.428711 9.54199 0.357422 9.4541 0.304688C9.36621 0.251953 9.26562 0.225586 9.15234 0.225586C8.99219 0.225586 8.85156 0.28418 8.73047 0.401367L4.87162 4.35337L1.00781 0.401367C0.890625 0.28418 0.751953 0.225586 0.591797 0.225586C0.478516 0.225586 0.37793 0.251953 0.290039 0.304688C0.202148 0.357422 0.131836 0.428711 0.0791016 0.518555C0.0263672 0.608398 0 0.708008 0 0.817383C0 0.899414 0.015625 0.974609 0.046875 1.04297C0.078125 1.11133 0.121094 1.17285 0.175781 1.22754L4.42383 5.58105C4.55664 5.70996 4.70508 5.77441 4.86914 5.77441Z"
      fill={color}
    />
  </svg>
);

export const ShortArrowIcon = ({ color = "white" }) => (
  <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.34431 1.25304C5.32879 1.23897 5.31414 1.22645 5.29862 1.2155C5.29086 1.20925 5.28224 1.20377 5.27362 1.19751C5.26931 1.19439 5.26586 1.19204 5.26069 1.18891C5.13655 1.10444 4.98224 1.05439 4.815 1.05439C4.64776 1.05439 4.49431 1.10444 4.36931 1.18891C4.36414 1.19282 4.35811 1.19595 4.35293 1.20064C4.34604 1.20533 4.33914 1.21003 4.33224 1.2155C4.31673 1.22723 4.30035 1.23974 4.28483 1.2546L0.951272 4.27744C0.65817 4.54335 0.65817 4.97429 0.951272 5.2402C1.24437 5.5061 1.71939 5.5061 2.01249 5.2402L4.06511 3.37804L4.06511 11.2649C4.06511 11.6411 4.40131 11.9453 4.81511 11.9453C5.22977 11.9453 5.56511 11.6411 5.56511 11.2649L5.56511 3.37884L7.61773 5.241C7.91083 5.5069 8.38585 5.5069 8.67981 5.241C8.97291 4.97509 8.97291 4.54415 8.67981 4.27825L5.34691 1.2546L5.34431 1.25304Z"
      fill={color}
      stroke={color}
      strokeWidth="0.680683"
    />
  </svg>
);

export const SharePriviIcon = ({ color = "white" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 1.00001L6.99997 11M17 1.00001L17 7.00001M17 1.00001L11 1M7 1.00001H1V17H17V11"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SparkIcon = ({ color = "white" }) => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 1.6665L7.66667 6.99984L5 4.33317L1 8.33317" fill="white" />
    <path d="M9 1.6665H13V5.6665" fill="white" />
    <path
      d="M13 1.6665L7.66667 6.99984L5 4.33317L1 8.33317M13 1.6665H9M13 1.6665V5.6665"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UnionIcon = () => (
  <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.8"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 1.75C0.5 1.19772 0.947715 0.75 1.5 0.75H11.5C12.0523 0.75 12.5 1.19772 12.5 1.75C12.5 2.30228 12.0523 2.75 11.5 2.75H1.5C0.947715 2.75 0.5 2.30228 0.5 1.75ZM0.5 5.75C0.5 5.19772 0.947715 4.75 1.5 4.75H11.5C12.0523 4.75 12.5 5.19772 12.5 5.75C12.5 6.30228 12.0523 6.75 11.5 6.75H1.5C0.947715 6.75 0.5 6.30228 0.5 5.75ZM1.5 8.75C0.947715 8.75 0.5 9.19771 0.5 9.75C0.5 10.3023 0.947715 10.75 1.5 10.75H11.5C12.0523 10.75 12.5 10.3023 12.5 9.75C12.5 9.19771 12.0523 8.75 11.5 8.75H1.5Z"
      fill="#2D3047"
    />
  </svg>
);

export const DetailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 6.5 0.625)" fill="#2D3047" />
    <rect x="6.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 6.5 7.625)" fill="#2D3047" />
    <rect x="13.5" y="0.625" width="6" height="6" rx="1" transform="rotate(90 13.5 0.625)" fill="#2D3047" />
    <rect x="13.5" y="7.625" width="6" height="6" rx="1" transform="rotate(90 13.5 7.625)" fill="#2D3047" />
  </svg>
);

export const ArrowUpIcon = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.04857 1.00139C4.03717 0.991049 4.0264 0.981857 4.01501 0.973814C4.00931 0.969218 4.00298 0.965197 3.99664 0.960601C3.99348 0.958303 3.99094 0.956579 3.98714 0.954281C3.89596 0.892235 3.78261 0.855469 3.65976 0.855469C3.53691 0.855469 3.4242 0.892235 3.33238 0.954281C3.32858 0.957153 3.32414 0.959451 3.32035 0.962898C3.31528 0.966345 3.31021 0.969792 3.30515 0.973814C3.29375 0.982432 3.28172 0.991622 3.27032 1.00254L0.821631 3.22298C0.606332 3.41831 0.606332 3.73486 0.821631 3.93018C1.03693 4.1255 1.38586 4.1255 1.60116 3.93018L3.10892 2.56232L3.10892 8.35567C3.10892 8.632 3.35588 8.85547 3.65984 8.85547C3.96443 8.85547 4.21076 8.632 4.21076 8.35567L4.21076 2.56291L5.71852 3.93077C5.93382 4.12609 6.28275 4.12609 6.49868 3.93077C6.71398 3.73545 6.71398 3.4189 6.49868 3.22357L4.05048 1.00254L4.04857 1.00139Z"
      fill="#00D13B"
      stroke="#00D13B"
      strokeWidth="0.5"
    />
  </svg>
);

export const ArrowDownIcon = () => (
  <svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.11159 8.20955C3.12299 8.21989 3.13375 8.22908 3.14515 8.23712C3.15085 8.24172 3.15718 8.24574 3.16351 8.25034C3.16668 8.25263 3.16921 8.25436 3.17301 8.25666C3.2642 8.3187 3.37755 8.35547 3.5004 8.35547C3.62324 8.35547 3.73596 8.3187 3.82778 8.25666C3.83158 8.25378 3.83601 8.25149 3.83981 8.24804C3.84488 8.24459 3.84994 8.24115 3.85501 8.23712C3.86641 8.22851 3.87844 8.21932 3.88984 8.2084L6.33852 5.98795C6.55382 5.79263 6.55382 5.47608 6.33852 5.28076C6.12323 5.08544 5.7743 5.08544 5.559 5.28076L4.05123 6.64862L4.05123 0.855268C4.05123 0.57894 3.80427 0.355469 3.50032 0.355469C3.19573 0.355469 2.9494 0.57894 2.9494 0.855267L2.9494 6.64803L1.44163 5.28017C1.22634 5.08485 0.877407 5.08485 0.661475 5.28017C0.446175 5.47549 0.446175 5.79204 0.661475 5.98736L3.10968 8.2084L3.11159 8.20955Z"
      fill="#F43E5F"
      stroke="#F43E5F"
      strokeWidth="0.5"
    />
  </svg>
);

export const GrowIcon = () => (
  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 1.02222L7.66667 6.35555L5 3.68888L1 7.68888" fill="white" />
    <path d="M9 1.02222H13V5.02222" fill="white" />
    <path
      d="M13 1.02222L7.66667 6.35555L5 3.68888L1 7.68888M13 1.02222H9M13 1.02222V5.02222"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GradientArrowIcon = () => (
  <svg width="100%" height="25" viewBox="0 0 164 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M162.559 13L1.05762 13M162.559 13L150.645 24M162.559 13L151.638 1"
      stroke="url(#paint0_linear)"
      strokeWidth="1.5"
      strokeLinecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="13.2824"
        y1="11.5494"
        x2="90.6591"
        y2="84.3289"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stop-color="#A0D800" />
        <stop offset="0.852705" stop-color="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);

export const GradientMobileArrowIcon = () => (
  <svg width="16" height="50" viewBox="0 0 16 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.73913 48L7.73914 2M7.73913 48L2 44.1269M7.73913 48L14 44.4497" stroke="url(#paint0_linear)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear" x1="8.49598" y1="5.48194" x2="-8.38242" y2="38.3522" gradientUnits="userSpaceOnUse">
        <stop offset="0.179206" stop-color="#A0D800"/>
        <stop offset="0.852705" stop-color="#0DCC9E"/>
      </linearGradient>
    </defs>
  </svg>
);

export const EtherScanIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.4838 1.30861L7.48385 11.3086M17.4838 1.30861L17.4839 7.3086M17.4838 1.30861L11.4839 1.30859M7.48389 1.30861H1.48389V17.3086H17.4839V11.3086"
      stroke="#65CB63"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const RepayIcon = () => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="#65CB63">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.0034 5.64331L15.0055 5.64545C16.1316 6.7751 16.6946 8.13745 16.6946 9.73156C16.6946 11.3265 16.1309 12.6881 15.0034 13.8155C13.8759 14.9428 12.515 15.5067 10.92 15.5067L4.9042 15.506C4.5324 15.506 4.21414 15.3747 3.9508 15.1114C3.6882 14.8481 3.55617 14.5305 3.55617 14.1587C3.55617 13.7869 3.68819 13.4694 3.9508 13.2061C4.21413 12.9427 4.53169 12.8114 4.9042 12.8114H10.9193C11.7699 12.8114 12.4964 12.511 13.098 11.9094C13.6988 11.3078 13.9993 10.5821 13.9993 9.73072C13.9986 8.87937 13.6981 8.15221 13.098 7.54782L13.0958 7.54568C12.4943 6.94552 11.7692 6.64581 10.9193 6.64581L5.9419 6.64724L7.07155 7.55852C7.36056 7.79331 7.5247 8.09516 7.56465 8.46409C7.6039 8.83302 7.50614 9.162 7.27206 9.45245C7.03801 9.74217 6.73685 9.90774 6.36863 9.94698C5.9997 9.98623 5.67001 9.88989 5.37814 9.65582L1.32546 6.38539C1.31832 6.37897 1.31118 6.37326 1.30405 6.36755C1.2962 6.36113 1.28835 6.35471 1.2805 6.34829C1.27336 6.34258 1.26623 6.33687 1.25838 6.33116L1.19558 6.27407C1.04215 6.12921 0.930832 5.96223 0.861613 5.7724C0.850195 5.741 0.840204 5.7096 0.830213 5.6782C0.820936 5.64609 0.813086 5.61469 0.806663 5.58187C0.791677 5.50765 0.782401 5.43129 0.779545 5.35209C0.775977 5.26717 0.780259 5.18367 0.791677 5.10232L0.842342 4.88039C0.847338 4.86327 0.85376 4.84614 0.860183 4.82973L1.00505 4.54856C1.05357 4.47791 1.10995 4.41083 1.17417 4.34589C1.17631 4.34375 1.17917 4.34089 1.18202 4.33804L1.24482 4.27881C1.25766 4.26739 1.27122 4.25597 1.28407 4.24527C1.30262 4.23028 1.32189 4.21601 1.34116 4.20174L5.25025 1.07545C5.54212 0.843535 5.87179 0.749324 6.24074 0.79072C6.60896 0.832109 6.90941 0.998378 7.14204 1.28954C7.37467 1.57997 7.4703 1.90966 7.42891 2.2779C7.38823 2.64612 7.22196 2.94728 6.93222 3.18133L5.96957 3.95131H10.92C12.5149 3.95203 13.8765 4.51577 15.0033 5.64328L15.0034 5.64331Z"
    />
  </svg>
);

export const BorrowIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="#2D3047">
    <path
      opacity="0.7"
      d="M11.1152 0.0820312C5.28965 0.0820312 0.549561 4.82188 0.549561 10.6496C0.549561 16.4713 5.28941 21.2075 11.1152 21.2075C16.9369 21.2075 21.6731 16.4714 21.6731 10.6496C21.6731 4.82212 16.9371 0.0820312 11.1152 0.0820312ZM11.1114 10.0782C12.6219 10.0782 13.8524 11.3069 13.8524 12.8192C13.8524 14.1361 12.9168 15.2389 11.6769 15.5V16.7324C11.6769 17.0443 11.4233 17.2979 11.1114 17.2979C10.7996 17.2979 10.546 17.0443 10.546 16.7324V15.5C9.30419 15.2389 8.36863 14.1361 8.36863 12.8192C8.36863 12.5073 8.62224 12.2537 8.93411 12.2537C9.24597 12.2537 9.49959 12.5073 9.49959 12.8192C9.49959 13.7078 10.2229 14.4292 11.1115 14.4292C12.0001 14.4292 12.7215 13.7059 12.7215 12.8192C12.7215 11.9306 11.9982 11.2073 11.1115 11.2073C9.59919 11.2073 8.37055 9.97864 8.37055 8.46635C8.37055 7.14753 9.30611 6.04667 10.5479 5.78552V4.55313C10.5479 4.24127 10.8015 3.98765 11.1134 3.98765C11.4252 3.98765 11.6789 4.24127 11.6789 4.55313V5.78552C12.9206 6.04666 13.8543 7.14941 13.8543 8.46635C13.8543 8.7782 13.6007 9.03183 13.2888 9.03183C12.977 9.03183 12.7233 8.77821 12.7233 8.46635C12.7233 7.57773 12.0001 6.85445 11.1133 6.85445C10.2247 6.85445 9.50142 7.57773 9.50142 8.46635C9.49954 9.35684 10.2228 10.0782 11.1114 10.0782Z"
    />
  </svg>
);

export const UnstakeIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="#2D3047">
    <path
      opacity="0.7"
      d="M10.3481 0.323242C4.64726 0.323242 0.0268555 4.94365 0.0268555 10.6445C0.0268555 16.3453 4.64726 20.9657 10.3481 20.9657C16.0481 20.9657 20.6693 16.3453 20.6693 10.6445C20.6693 4.94365 16.0489 0.323242 10.3481 0.323242ZM13.8848 12.7007C14.4113 13.1958 14.5943 13.7836 14.0509 14.3351C13.5066 14.8867 12.922 14.719 12.4156 14.1981L10.3158 12.037C9.57724 12.8232 8.93216 13.5175 8.27901 14.2012C7.77585 14.7285 7.18238 14.8833 6.64535 14.3294C6.10751 13.7754 6.29861 13.1908 6.82194 12.6949C7.48879 12.0619 8.15482 11.4289 9.09591 10.5338C8.28633 9.84845 7.5558 9.25013 6.85269 8.62361C6.28824 8.12045 6.07699 7.49876 6.68659 6.92221C7.25103 6.38922 7.83402 6.60775 8.32186 7.12864C8.94921 7.79791 9.57412 8.4704 10.3539 9.3058C11.1602 8.44542 11.8029 7.74632 12.4584 7.05845C12.9341 6.55851 13.5066 6.43435 14.0219 6.9246C14.5815 7.45839 14.4428 8.05025 13.9162 8.55826C13.2325 9.21544 12.539 9.86132 11.6939 10.6588C12.5026 11.4104 13.1961 12.0522 13.8847 12.7005L13.8848 12.7007Z"
    />
  </svg>
);

export const AddIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="14" fill="#65CB63" />
    <path d="M14 9V19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 14L9 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const RemoveIcon = () => (
  <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.52783 1.138C3.52783 0.924792 3.70067 0.751953 3.91388 0.751953H6.71928C6.93249 0.751953 7.10532 0.924792 7.10532 1.138C7.10532 1.35121 6.93249 1.52405 6.71928 1.52405H3.91388C3.70067 1.52405 3.52783 1.35121 3.52783 1.138Z"
      fill="#F43E5F"
    />
    <path
      d="M0.632324 3.01819H1.66178L2.30519 10.2244C2.31876 10.4275 2.48766 10.5853 2.69124 10.5848H7.94109C8.14466 10.5853 8.31356 10.4275 8.32713 10.2244L8.97054 3.01819H10V2.24609H0.632324V3.01819Z"
      fill="#F43E5F"
    />
  </svg>
);

export const EditIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.12681 0C7.64712 0 7.16783 0.18281 6.80221 0.54805C4.70731 2.64295 2.61241 4.73785 0.517413 6.83285L3.16821 9.48365C5.26311 7.38875 7.35801 5.29385 9.45301 3.19885C10.1839 2.46799 10.1819 1.27855 9.45145 0.54805C9.08622 0.18282 8.60653 0 8.12685 0H8.12681ZM0.192413 7.3918L0.000612788 9.6629C-0.0154032 9.85587 0.145533 10.0168 0.338113 10.0004L2.60801 9.80782L0.192413 7.3918Z"
      fill="#54658F"
    />
  </svg>
);

export const CarouselArrowLeft = () => (
  <svg width="31" height="16" viewBox="0 0 31 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.99947 14.7177L1.31 8.23725M1.31 8.23725L7.99947 1.75684M1.31 8.23725H29.5166"
      stroke="#181818"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CarouselArrowRight = () => (
  <svg width="31" height="16" viewBox="0 0 31 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.0005 14.7177L29.69 8.23725M29.69 8.23725L23.0005 1.75684M29.69 8.23725H1.4834"
      stroke="#181818"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const AddQueueIcon = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5635 2.54735H6.06348C5.91672 2.54735 5.79786 2.42848 5.79786 2.28173V0.863281C5.79786 0.716524 5.91672 0.597656 6.06348 0.597656H14.5635C14.6339 0.597656 14.7016 0.625546 14.7514 0.675351C14.8012 0.725156 14.8291 0.792891 14.8291 0.863286V2.28173C14.8291 2.35212 14.8012 2.41986 14.7514 2.46967C14.7016 2.51947 14.6339 2.54736 14.5635 2.54736V2.54735ZM14.5635 7.50387H6.06348C5.91672 7.50387 5.79786 7.385 5.79786 7.23825V5.82247C5.79786 5.67571 5.91672 5.55684 6.06348 5.55684H14.5635C14.6339 5.55684 14.7016 5.58474 14.7514 5.63454C14.8012 5.68434 14.8291 5.75208 14.8291 5.82247V7.23825C14.8291 7.30864 14.8012 7.37638 14.7514 7.42619C14.7016 7.47599 14.6339 7.50388 14.5635 7.50388V7.50387ZM14.5635 12.4019H1.81348C1.66672 12.4019 1.54786 12.283 1.54786 12.1363V10.7178C1.54786 10.5711 1.66672 10.4522 1.81348 10.4522H14.5635C14.6339 10.4522 14.7016 10.4801 14.7514 10.5299C14.8012 10.5797 14.8291 10.6475 14.8291 10.7178V12.1363C14.8291 12.2067 14.8012 12.2744 14.7514 12.3242C14.7016 12.374 14.6339 12.4019 14.5635 12.4019V12.4019ZM0.4375 7.12919C0.290742 7.12919 0.171875 7.01032 0.171875 6.86357V1.23759C0.172539 1.14329 0.223008 1.05564 0.305352 1.00848C0.387697 0.961993 0.488629 0.961993 0.570314 1.00914L5.44455 3.82213C5.52623 3.86994 5.5767 3.95694 5.5767 4.0519C5.5767 4.14686 5.52623 4.23385 5.44455 4.28168L0.570314 7.09467C0.529807 7.11791 0.483986 7.1292 0.437502 7.1292L0.4375 7.12919Z" />
  </svg>
)

export const ArtistIcon = () => (
  <svg width="15" height="16" viewBox="0 0 15 16" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0.800195H14.25V2.6002H12.45V7.5502C12.45 8.17304 12.1916 8.76836 11.7363 9.19375C11.2817 9.61855 10.6705 9.83653 10.0488 9.79492C9.42716 9.75273 8.85117 9.45508 8.45688 8.97284C8.06313 8.49002 7.88676 7.86601 7.97055 7.24844C8.05375 6.63086 8.3895 6.07598 8.89692 5.71559C9.40493 5.35466 10.0395 5.22047 10.6501 5.34527V2.15012C10.6501 1.4048 11.2548 0.80012 12.0001 0.80012L12 0.800195ZM5.7 2.6002C5.7 1.87187 5.26171 1.21562 4.58907 0.937295C3.91641 0.658385 3.14181 0.812491 2.62737 1.32754C2.11233 1.84199 1.95824 2.61661 2.23713 3.28924C2.51546 3.9619 3.17171 4.40017 3.90003 4.40017C4.89437 4.40017 5.70003 3.5945 5.70003 2.60017L5.7 2.6002ZM2.55 15.2002H5.25C5.49843 15.2002 5.7 14.9986 5.7 14.7502V10.7002H6.375C6.74766 10.7002 7.05 10.3979 7.05 10.0252V5.9752C7.05 5.60254 6.74766 5.3002 6.375 5.3002H1.425C1.05234 5.3002 0.75 5.60254 0.75 5.9752V10.0252C0.75 10.3979 1.05234 10.7002 1.425 10.7002H2.1V14.7502C2.1 14.9986 2.30157 15.2002 2.55 15.2002Z" />
  </svg>
)

export const AlbumIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M1.49942 1.99805H2.39942V13.9976H1.49942V1.99805Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M15.6006 1.99805H16.5006V13.9976H15.6006V1.99805Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M17.1 3.20044H18V12.8009H17.1V3.20044Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M0 3.20044H0.9V12.8009H0V3.20044Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.00058 15.1993H15.0001V0.799316H3.00058V15.1993ZM5.85034 9.79932C6.37418 9.79932 6.84948 9.99197 7.20034 10.3035V4.39928C7.20034 4.25162 7.30792 4.12577 7.45346 4.10327L13.1537 3.20327C13.2409 3.18921 13.3288 3.21452 13.3949 3.27147C13.4617 3.32843 13.5003 3.4114 13.5003 3.49928V9.79928C13.5003 10.7921 12.6256 11.5993 11.5506 11.5993C10.4748 11.5993 9.60009 10.7921 9.60009 9.79928C9.60009 8.80647 10.4748 7.99928 11.5506 7.99928C12.0744 7.99928 12.5497 8.19194 12.9006 8.50343V5.65007L7.80009 6.45515V11.6302L7.79798 11.6407C7.77337 12.6138 6.90993 13.3992 5.85038 13.3992C4.77529 13.3992 3.90062 12.592 3.90062 11.5992C3.90062 10.6064 4.77531 9.79921 5.85038 9.79921L5.85034 9.79932Z" />
  </svg>
)

export const RemovePlayListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.99966 0.84668C4.50418 0.84668 0.84668 4.50418 0.84668 8.99966C0.84668 13.4951 4.50418 17.1526 8.99966 17.1526C13.4951 17.1526 17.1526 13.4951 17.1526 8.99966C17.1526 4.50418 13.4951 0.84668 8.99966 0.84668ZM12.2334 9.92938H5.76588V8.07056H12.2334V9.92938Z" />
  </svg>
)

export const AddPlayListIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="#54658F" stroke="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M2.00032 3.49878C2.00032 2.67035 2.67189 1.99878 3.50032 1.99878H11.5003C12.3287 1.99878 13.0003 2.67035 13.0003 3.49878C13.0003 4.32721 12.3287 4.99878 11.5003 4.99878H3.50032C2.67189 4.99878 2.00032 4.32721 2.00032 3.49878ZM2.00032 8.49878C2.00032 7.67035 2.67189 6.99878 3.50032 6.99878H11.5003C12.3287 6.99878 13.0003 7.67035 13.0003 8.49878C13.0003 9.32721 12.3287 9.99878 11.5003 9.99878H3.50032C2.67189 9.99878 2.00032 9.32721 2.00032 8.49878ZM3.50032 11.9988C2.67189 11.9988 2.00032 12.6704 2.00032 13.4988C2.00032 14.3272 2.67189 14.9988 3.50032 14.9988H7.50032C8.32875 14.9988 9.00032 14.3272 9.00032 13.4988C9.00032 12.6704 8.32875 11.9988 7.50032 11.9988H3.50032Z" />
    <path d="M15.25 12.75V11.5C15.25 11.0858 14.9142 10.75 14.5 10.75C14.0858 10.75 13.75 11.0858 13.75 11.5V12.75H12.5C12.0858 12.75 11.75 13.0858 11.75 13.5C11.75 13.9142 12.0858 14.25 12.5 14.25H13.75V15.5C13.75 15.9142 14.0858 16.25 14.5 16.25C14.9142 16.25 15.25 15.9142 15.25 15.5V14.25H16.5C16.9142 14.25 17.25 13.9142 17.25 13.5C17.25 13.0858 16.9142 12.75 16.5 12.75H15.25Z" strokeWidth="0.5" />
  </svg>
)

export const TwitterShareIcon = () => (
  <svg width="16" height="13" viewBox="0 0 16 13" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1.5C15.4 1.8 14.8 1.9 14.1 2C14.8 1.6 15.3 1 15.5 0.2C14.9 0.6 14.2 0.8 13.4 1C12.8 0.4 11.9 0 11 0C8.9 0 7.3 2 7.8 4C5.1 3.9 2.7 2.6 1 0.6C0.1 2.1 0.6 4 2 5C1.5 5 1 4.8 0.5 4.6C0.5 6.1 1.6 7.5 3.1 7.9C2.6 8 2.1 8.1 1.6 8C2 9.3 3.2 10.3 4.7 10.3C3.5 11.2 1.7 11.7 0 11.5C1.5 12.4 3.2 13 5 13C11.1 13 14.5 7.9 14.3 3.2C15 2.8 15.6 2.2 16 1.5Z" />
  </svg>
)

export const FaceBookShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8C16 3.6 12.4 0 8 0C3.6 0 0 3.6 0 8C0 12 2.9 15.3 6.7 15.9V10.3H4.7V8H6.7V6.2C6.7 4.2 7.9 3.1 9.7 3.1C10.6 3.1 11.5 3.3 11.5 3.3V5.3H10.5C9.5 5.3 9.2 5.9 9.2 6.5V8H11.4L11 10.3H9.1V16C13.1 15.4 16 12 16 8Z" />
  </svg>
)

export const InstagramShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.44578C10.1205 1.44578 10.4096 1.44578 11.2771 1.44578C12.0482 1.44578 12.4337 1.63855 12.7229 1.73494C13.1084 1.92771 13.3976 2.0241 13.6867 2.31325C13.9759 2.60241 14.1687 2.89157 14.2651 3.27711C14.3614 3.56627 14.4578 3.95181 14.5542 4.72289C14.5542 5.59036 14.5542 5.78313 14.5542 8C14.5542 10.2169 14.5542 10.4096 14.5542 11.2771C14.5542 12.0482 14.3614 12.4337 14.2651 12.7229C14.0723 13.1084 13.9759 13.3976 13.6867 13.6867C13.3976 13.9759 13.1084 14.1687 12.7229 14.2651C12.4337 14.3614 12.0482 14.4578 11.2771 14.5542C10.4096 14.5542 10.2169 14.5542 8 14.5542C5.78313 14.5542 5.59036 14.5542 4.72289 14.5542C3.95181 14.5542 3.56627 14.3614 3.27711 14.2651C2.89157 14.0723 2.60241 13.9759 2.31325 13.6867C2.0241 13.3976 1.83133 13.1084 1.73494 12.7229C1.63855 12.4337 1.54217 12.0482 1.44578 11.2771C1.44578 10.4096 1.44578 10.2169 1.44578 8C1.44578 5.78313 1.44578 5.59036 1.44578 4.72289C1.44578 3.95181 1.63855 3.56627 1.73494 3.27711C1.92771 2.89157 2.0241 2.60241 2.31325 2.31325C2.60241 2.0241 2.89157 1.83133 3.27711 1.73494C3.56627 1.63855 3.95181 1.54217 4.72289 1.44578C5.59036 1.44578 5.87952 1.44578 8 1.44578ZM8 0C5.78313 0 5.59036 0 4.72289 0C3.85542 0 3.27711 0.192772 2.79518 0.385543C2.31325 0.578314 1.83133 0.867471 1.3494 1.3494C0.867471 1.83133 0.674699 2.21687 0.385543 2.79518C0.192772 3.27711 0.0963856 3.85542 0 4.72289C0 5.59036 0 5.87952 0 8C0 10.2169 0 10.4096 0 11.2771C0 12.1446 0.192772 12.7229 0.385543 13.2048C0.578314 13.6867 0.867471 14.1687 1.3494 14.6506C1.83133 15.1325 2.21687 15.3253 2.79518 15.6145C3.27711 15.8072 3.85542 15.9036 4.72289 16C5.59036 16 5.87952 16 8 16C10.1205 16 10.4096 16 11.2771 16C12.1446 16 12.7229 15.8072 13.2048 15.6145C13.6867 15.4217 14.1687 15.1325 14.6506 14.6506C15.1325 14.1687 15.3253 13.7831 15.6145 13.2048C15.8072 12.7229 15.9036 12.1446 16 11.2771C16 10.4096 16 10.1205 16 8C16 5.87952 16 5.59036 16 4.72289C16 3.85542 15.8072 3.27711 15.6145 2.79518C15.4217 2.31325 15.1325 1.83133 14.6506 1.3494C14.1687 0.867471 13.7831 0.674699 13.2048 0.385543C12.7229 0.192772 12.1446 0.0963856 11.2771 0C10.4096 0 10.2169 0 8 0Z" />
    <path d="M8 3.85542C5.68675 3.85542 3.85542 5.68675 3.85542 8C3.85542 10.3133 5.68675 12.1446 8 12.1446C10.3133 12.1446 12.1446 10.3133 12.1446 8C12.1446 5.68675 10.3133 3.85542 8 3.85542ZM8 10.6988C6.55422 10.6988 5.30121 9.54217 5.30121 8C5.30121 6.55422 6.45783 5.30121 8 5.30121C9.44578 5.30121 10.6988 6.45783 10.6988 8C10.6988 9.44578 9.44578 10.6988 8 10.6988Z" />
    <path d="M12.241 4.72289C12.7733 4.72289 13.2048 4.29136 13.2048 3.75904C13.2048 3.22671 12.7733 2.79518 12.241 2.79518C11.7086 2.79518 11.2771 3.22671 11.2771 3.75904C11.2771 4.29136 11.7086 4.72289 12.241 4.72289Z" />
  </svg>
)

export const SongShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.33325 0.333252H12.3333C13.0666 0.333252 13.6666 0.933252 13.6666 1.66659V9.66659C13.6666 10.3999 13.0666 10.9999 12.3333 10.9999H4.33325C3.59992 10.9999 2.99992 10.3999 2.99992 9.66659V1.66659C2.99992 0.933252 3.59992 0.333252 4.33325 0.333252ZM4.33325 9.66659H12.3333V1.66659H4.33325V9.66659ZM7.33325 8.99992C8.25325 8.99992 8.99992 8.25325 8.99992 7.33325V3.66659H10.9999V2.33325H8.33325V6.00659C8.05325 5.79325 7.71325 5.66659 7.33325 5.66659C6.41325 5.66659 5.66658 6.41325 5.66658 7.33325C5.66658 8.25325 6.41325 8.99992 7.33325 8.99992ZM0.333252 2.99992H1.66659V12.3333H10.9999V13.6666H1.66659C0.933252 13.6666 0.333252 13.0666 0.333252 12.3333V2.99992Z" />
  </svg>
)

export const DownloadQRIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 0H5.33333V6.66667H0V0ZM12 0H6.66667V4H12V0ZM4 5.33333V1.33333H1.33333V5.33333H4ZM10.6667 2.66667V1.33333H8V2.66667H10.6667ZM10.6667 6.66667V10.6667H8V6.66667H10.6667ZM4 10.6667V9.33333H1.33333V10.6667H4ZM12 5.33333H6.66667V12H12V5.33333ZM0 8H5.33333V12H0V8Z" />
  </svg>
)

export const CopyAddressIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="#54658F" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 0.666748H2.00008C1.26675 0.666748 0.666748 1.26675 0.666748 2.00008V11.3334H2.00008V2.00008H10.0001V0.666748ZM12.0001 3.33341H4.66675C3.93341 3.33341 3.33342 3.93341 3.33342 4.66675V14.0001C3.33342 14.7334 3.93341 15.3334 4.66675 15.3334H12.0001C12.7334 15.3334 13.3334 14.7334 13.3334 14.0001V4.66675C13.3334 3.93341 12.7334 3.33341 12.0001 3.33341ZM4.66675 14.0001H12.0001V4.66675H4.66675V14.0001Z" />
  </svg>
)

export const HomeIcon = () => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 16.8V6.96614L20.4855 7.85746C20.9591 8.14161 21.5734 7.98805 21.8575 7.51447C22.1417 7.04089 21.9881 6.42663 21.5145 6.14248L16.4926 3.12932L12.6514 0.81504L12.6513 0.814967C12.3721 0.646748 12.1578 0.517644 11.9762 0.420566C11.9338 0.396857 11.8908 0.374804 11.8472 0.354409C11.696 0.28065 11.565 0.231554 11.4304 0.20189C11.1469 0.139409 10.8531 0.139409 10.5696 0.201891C10.4346 0.231633 10.3033 0.280907 10.1516 0.354986C10.1088 0.375046 10.0666 0.396705 10.0249 0.419962C9.84309 0.517113 9.6285 0.6464 9.3487 0.81498L9.34864 0.815012L5.50169 3.13278L0.485533 6.14248C0.011953 6.42663 -0.141612 7.04089 0.142536 7.51447C0.426684 7.98805 1.04094 8.14161 1.51452 7.85746L3 6.96618V16.8C3 17.9202 3 18.4802 3.21799 18.908C3.40973 19.2844 3.71569 19.5903 4.09202 19.7821C4.51984 20 5.0799 20 6.2 20L8 20V14C8 12.3431 9.34315 11 11 11C12.6569 11 14 12.3431 14 14V20L15.8 20C16.9201 20 17.4802 20 17.908 19.7821C18.2843 19.5903 18.5903 19.2844 18.782 18.908C19 18.4802 19 17.9202 19 16.8Z" fill="white" />
  </svg>
)

export const MusicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M21 4.39637C21 2.52466 19.3049 1.10994 17.4633 1.44476L10.4633 2.71749C9.03687 2.97685 8 4.21924 8 5.6691V19.5H10V9.83455L19 8.19818V17.5H21V4.39637ZM17.8211 3.4125C18.435 3.3009 19 3.77247 19 4.39637V6.16537L10 7.80173V5.6691C10 5.18581 10.3456 4.77168 10.8211 4.68523L17.8211 3.4125Z" fill="white" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M21 17.5C21 19.433 19.433 21 17.5 21C15.567 21 14 19.433 14 17.5C14 15.567 15.567 14 17.5 14C19.433 14 21 15.567 21 17.5ZM19 17.5C19 18.3284 18.3284 19 17.5 19C16.6716 19 16 18.3284 16 17.5C16 16.6716 16.6716 16 17.5 16C18.3284 16 19 16.6716 19 17.5Z" fill="white" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 19.5C10 21.433 8.433 23 6.5 23C4.567 23 3 21.433 3 19.5C3 17.567 4.567 16 6.5 16C8.433 16 10 17.567 10 19.5ZM8 19.5C8 20.3284 7.32843 21 6.5 21C5.67157 21 5 20.3284 5 19.5C5 18.6716 5.67157 18 6.5 18C7.32843 18 8 18.6716 8 19.5Z" fill="white" />
  </svg>
)

export const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9056 14.3199C11.551 15.3729 9.84871 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 9.84871 15.3729 11.551 14.3199 12.9056L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12.9056 14.3199ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" fill="white" />
  </svg>
)