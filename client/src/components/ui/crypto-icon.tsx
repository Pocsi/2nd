import * as React from "react";

interface CryptoIconProps {
  currency: string;
  className?: string;
  size?: number;
}

export function CryptoIcon({ currency, className = "", size = 5 }: CryptoIconProps) {
  // Map of cryptocurrency symbols to SVG paths and background colors
  const cryptoIcons: Record<string, { path: string; bgColor: string }> = {
    BTC: {
      path: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm-.2 17.8c-1.5 0-2.6-.4-3.4-1.2-.8-.8-1.1-1.9-1.1-3.4v-1h3v1c0 .9.2 1.5.6 1.8.4.3.9.5 1.7.5.7 0 1.2-.2 1.6-.5.4-.3.6-.8.6-1.3 0-.5-.1-.9-.4-1.2-.3-.3-.6-.5-.9-.7-.3-.2-.8-.4-1.4-.7-.9-.3-1.6-.7-2.1-1-.6-.3-1.1-.8-1.5-1.4-.4-.6-.6-1.4-.6-2.3 0-.9.2-1.6.6-2.2.4-.6 1-1.1 1.9-1.5.8-.3 1.7-.5 2.8-.5 1.3 0 2.4.3 3.2.9.8.6 1.3 1.4 1.6 2.6l-3 .5c-.2-.7-.5-1.1-.8-1.4-.3-.3-.8-.4-1.4-.4-.5 0-.9.1-1.2.4-.3.3-.5.6-.5 1 0 .3.1.6.2.8.2.2.4.4.6.6.3.2.7.4 1.4.7.9.4 1.7.7 2.2 1 .5.3 1 .7 1.4 1.3.4.5.6 1.3.6 2.2 0 .9-.2 1.7-.7 2.4-.5.7-1.1 1.2-1.9 1.6-.8.4-1.8.5-2.9.5z",
      bgColor: "#F7931A",
    },
    ETH: {
      path: "M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z",
      bgColor: "#627EEA",
    },
    SOL: {
      path: "M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z M7.64 15.39a.506.506 0 0 1 .358-.147h11.501c.23 0 .346.277.184.44l-2.503 2.503a.506.506 0 0 1-.358.147H5.322a.265.265 0 0 1-.184-.44l2.503-2.503zm0-9.586a.506.506 0 0 1 .358-.147h11.501c.23 0 .346.277.184.44L17.18 8.6a.506.506 0 0 1-.358.147H5.322a.265.265 0 0 1-.184-.44l2.503-2.503zm12.043 4.793a.506.506 0 0 0-.358-.147H7.824a.265.265 0 0 0-.184.44l2.503 2.503a.506.506 0 0 0 .358.147h11.501c.23 0 .346-.277.184-.44l-2.503-2.503z",
      bgColor: "#14F195",
    },
    DOGE: {
      path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 17v-4H8v-2h2V7h4.5c1.3 0 2.5 1 2.5 2.5S15.8 12 14.5 12H12v3h3v2h-3v2h-2z",
      bgColor: "#C2A633",
    },
    ADA: {
      path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.243 18.91a5.95 5.95 0 0 1-.614-.614 5.022 5.022 0 0 1-.614-3.4c.138-.752.478-1.408.957-1.971.239-.283.512-.53.802-.742-.9.561-1.619 1.291-2.092 2.115a4.143 4.143 0 0 0-.478 3.196 3.507 3.507 0 0 0 2.039 2.416zm1.018-7.225c.14-.157.284-.305.435-.442 1.025-.87 2.483-1.329 3.903-1.233 1.025.07 1.971.425 2.689 1.07-1.304-.598-2.742-.887-4.15-.784-1.189.087-2.289.478-3.206 1.106.409-.048.783-.013 1.149.111.55.187 1.025.561 1.312 1.088.153.27.242.561.304.87.044-.29.044-.598.013-.899-.044-.435-.187-.886-.449-1.243-.165-.222-.382-.416-.63-.556.283.091.53.23.757.404.326.256.57.6.732 1.002.16.419.194.89.09 1.347-.07.326-.228.625-.442.87-.283.313-.664.539-1.088.596-.222.031-.452.013-.674-.035 1.189.13 2.306-.408 3.01-1.337.457-.599.7-1.365.596-2.125-.213-1.416-1.538-2.49-2.994-2.585-1.33-.087-2.68.512-3.332 1.694-.327.578-.45 1.279-.34 1.945.7.465.27.886.586 1.235-.83-.404-1.437-.904-1.833-1.573a3.01 3.01 0 0 1-.337-2.385c.187-.717.613-1.33 1.182-1.85-1.676.709-2.855 2.407-2.82 4.302-.017.665.126 1.32.423 1.893.5.961 1.363 1.71 2.397 2.06-.96-.457-1.728-1.286-2.065-2.325-.27-.804-.256-1.669.034-2.473-.204.961-.139 1.989.248 2.855.517 1.165 1.519 2.038 2.724 2.342-.926-.244-1.76-.8-2.368-1.55a4.43 4.43 0 0 1-.909-2.35c-.017 1.016.309 2.012.926 2.802.508.664 1.208 1.182 2 1.486-1.174-.23-2.185-.973-2.75-2.04a4.25 4.25 0 0 1-.243-3.258c-.308.83-.382 1.763-.17 2.628.299 1.235 1.166 2.255 2.306 2.724z",
      bgColor: "#0033AD",
    },
    SHIB: {
      path: "M11.5038 1.51445e-06C10.2141 -0.00151771 8.93496 0.212468 7.7239 0.632036C6.51284 1.0516 5.39063 1.67043 4.41183 2.46223C3.43303 3.25402 2.61475 4.20329 2.00016 5.26473C1.38557 6.32616 0.98407 7.48151 0.813438 8.67734C0.642805 9.87317 0.705742 11.0881 0.999225 12.2633C1.29271 13.4385 1.81186 14.5522 2.5307 15.5449C3.24953 16.5375 4.15611 17.3903 5.20089 18.0579C6.24566 18.7255 7.40918 19.196 8.63066 19.4437V13.137H6.13066V10.2498H8.63066V8.0998C8.63066 5.57539 10.0657 4.2498 12.3557 4.2498C13.4557 4.2498 14.6057 4.4498 14.6057 4.4498V6.8748H13.3557C12.1306 6.8748 11.7307 7.6748 11.7307 8.4998V10.2498H14.5057L14.0557 13.137H11.7307V19.4437C12.9522 19.196 14.1157 18.7255 15.1605 18.0579C16.2052 17.3903 17.1118 16.5375 17.8306 15.5449C18.5495 14.5522 19.0686 13.4385 19.3621 12.2633C19.6556 11.0881 19.7185 9.87317 19.5479 8.67734C19.3772 7.48151 18.9757 6.32616 18.3611 5.26473C17.7466 4.20329 16.9283 3.25402 15.9495 2.46223C14.9707 1.67043 13.8485 1.0516 12.6374 0.632036C11.4263 0.212468 10.1472 -0.00151771 8.85751 1.51445e-06H11.5038Z",
      bgColor: "#E84142",
    },
  };

  // Default to Bitcoin if the currency is not found
  const cryptoInfo = cryptoIcons[currency.toUpperCase()] || cryptoIcons["BTC"];

  return (
    <div
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{ backgroundColor: cryptoInfo.bgColor, width: `${size * 8}px`, height: `${size * 8}px` }}
    >
      <svg
        className="text-white"
        width={`${size * 5}px`}
        height={`${size * 5}px`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d={cryptoInfo.path} />
      </svg>
    </div>
  );
}
