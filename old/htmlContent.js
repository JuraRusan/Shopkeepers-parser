// import { villager_images } from "./villager_images.js";
//
// export const htmlContent = ({ user, id = 0 }) => {
//   const currentTime = new Date().getTime();
//
//   // const formatWordByCount = (count, wordForms) => {
//   //   const cases = [2, 0, 1, 1, 1, 2];
//   //   let index;
//   //
//   //   if (count % 100 > 4 && count % 100 < 20) {
//   //     index = 2;
//   //   } else {
//   //     index = cases[Math.min(count % 10, 5)];
//   //   }
//   //
//   //   return wordForms[index];
//   // };
//
//   const convertUnixTime = ({ unixTime, direction }) => {
//     let timeDifference, throughString, backString;
//
//     if (direction === "seen") {
//       timeDifference = currentTime - unixTime;
//       throughString = "";
//       backString = "назад";
//     } else if (direction === "drop") {
//       timeDifference = unixTime - currentTime;
//       throughString = "через";
//       backString = "";
//     } else {
//       throw new Error("Неверное направление преобразования времени.");
//     }
//
//     const seconds = Math.floor(timeDifference / 1000) % 60;
//     const minutes = Math.floor(timeDifference / 1000 / 60) % 60;
//     const hours = Math.floor(timeDifference / 1000 / 60 / 60) % 24;
//     const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
//
//     // const daysForms = ["день", "дня", "дней"];
//     // const hoursForms = ["час", "часа", "часов"];
//     // const minutesForms = ["минута", "минуты", "минут"];
//     // const secondsForms = ["секунда", "секунды", "секунд"];
//     //
//     // const formattedDays = `${days} ${formatWordByCount(days, daysForms)}`;
//     // const formattedHours = `${hours} ${formatWordByCount(hours, hoursForms)}`;
//     // const formattedMinutes = `${minutes} ${formatWordByCount(minutes, minutesForms)}`;
//     // const formattedSeconds = `${seconds} ${formatWordByCount(seconds, secondsForms)}`;
//     //
//     // return `${throughString} ${days > 0 ? `${formattedDays}, ` : ""}${hours > 0 ? `${formattedHours}, ` : ""}${minutes > 0 ? `${formattedMinutes}, ` : ""}${formattedSeconds} ${backString}`;
//
//     const formattedParts = [];
//     if (days > 0) formattedParts.push(`${days} д.`);
//     if (hours > 0) formattedParts.push(`${hours} ч.`);
//     if (minutes > 0) formattedParts.push(`${minutes} м.`);
//     formattedParts.push(`${seconds} с.`);
//
//     return `${throughString} ${formattedParts.join(" ")} ${backString}`.trim();
//   };
//
//   const unixTimeConverter = (unixTime) => {
//     const convertUnixTime = (unixTime) => {
//       const date = new Date(parseInt(unixTime, 10));
//
//       const year = date.getFullYear();
//       const month = ("0" + (date.getMonth() + 1)).slice(-2);
//       const day = ("0" + date.getDate()).slice(-2);
//
//       const hours = ("0" + date.getHours()).slice(-2);
//       const minutes = ("0" + date.getMinutes()).slice(-2);
//       const seconds = ("0" + date.getSeconds()).slice(-2);
//
//       return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
//     };
//
//     return convertUnixTime(unixTime);
//   };
//
//   return `
// <html>
//   <head>
//     <style>
//       @import url("https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap");
//
//       :root {
//         --color-1: rgba(17, 17, 20, 1);
//         --color-2: rgba(255, 255, 255, 0.23);
//         --color-3: rgba(244, 244, 244, 1);
//         --color-4: rgba(0, 255, 0, 1);
//         --color-5: rgba(255, 180, 0, 1);
//         --color-6: rgba(228, 0, 127, 1);
//         --color-7: rgba(255, 0, 0, 1);
//       }
//
//       * {
//         margin: 0;
//         padding: 0;
//         box-sizing: border-box;
//         font-family: "Comic Neue", cursive;
//         font-weight: 400;
//       }
//
//       .main {
//         width: 750px;
//         height: 375px;
//         background: var(--color-1);
//         display: flex;
//         flex-direction: row;
//         padding: 12px;
//         position: relative;
//       }
//
//       .created {
//         position: absolute;
//         color: var(--color-2);
//         right: 4px;
//         bottom: 4px;
//         font-size: 13px;
//         font-style: italic;
//       }
//
//       .left {
//         display: flex;
//         flex-direction: column;
//         justify-content: flex-start;
//         width: 100%;
//         height: 100%;
//       }
//
//       .right {
//         display: flex;
//         flex-direction: column;
//         justify-content: flex-start;
//         height: 100%;
//         width: auto;
//       }
//
//       img {
//         width: 165px;
//         height: auto;
//       }
//
//       .stroke {
//         display: flex;
//         flex-direction: row;
//         justify-content: flex-start;
//         width: auto;
//         height: auto;
//         margin: 4px 0;
//       }
//
//       .text {
//         width: auto;
//         color: var(--color-3);
//         line-height: 24px;
//         height: 24px;
//         font-size: 15px;
//         font-family: "Comic Neue", cursive;
//         font-weight: 400;
//       }
//
//       .warn {
//         width: auto;
//         color: var(--color-5);
//         line-height: 24px;
//         height: 24px;
//         font-size: 13px;
//         font-family: "Comic Neue", cursive;
//         font-weight: 400;
//         margin-left: 8px;
//       }
//
//       ul {
//         margin-left: 10px;
//       }
//
//       .colored {
//         line-height: 24px;
//         height: 24px;
//         font-size: 15px;
//         margin-left: 6px;
//         font-family: "Comic Neue", cursive;
//         font-weight: 400;
//       }
//
//       .green {
//         color: var(--color-4);
//       }
//
//       .red {
//         color: var(--color-7);
//       }
//     </style>
//   </head>
//   <body>
//     <div class="main">
//       <span class="created">image created ${new Date()}</span>
//       <div class="left">
//         <div class="stroke">
//           <p class="text">Владелец:</p>
//           <span class="colored green">${user.owner}</span>
//         </div>
//         <div class="stroke">
//           <p class="text">Название:</p>
//           <span class="${!user.villager[id].name.length ? "colored red" : "colored green"}">${!user.villager[id].name.length ? "-" : user.villager[id].name}</span>
//         </div>
//         <div class="stroke">
//           <p class="text">Продано товара:</p>
//           <span class="colored green">${user.villager[id].log}</span>
//         </div>
//         <p class="text">Расположение:</p>
//         <ul>
//           <li class="stroke">
//             <p class="text">X:</p>
//             <span class="colored green">${user.villager[id].x}</span>
//           </li>
//           <li class="stroke">
//             <p class="text">Y:</p>
//             <span class="colored green">${user.villager[id].y}</span>
//           </li>
//           <li class="stroke">
//             <p class="text">Z:</p>
//             <span class="colored green">${user.villager[id].z}</span>
//           </li>
//         </ul>
//         <div class="stroke">
//           <p class="text">Последнее посещение:</p>
//           <span class="colored green">${convertUnixTime({ unixTime: user.last_seen, direction: "seen" })} (${unixTimeConverter(user.last_seen)})</span>
//         </div>
//         <div class="stroke">
//           <p class="text">Дата удаления:</p>
//           <span class="colored green">${convertUnixTime({ unixTime: user.last_seen + 2592000000, direction: "drop" })} (${unixTimeConverter(user.last_seen + 2592000000)})</span>
//         </div>
//         <div class="stroke">
//           <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 32 32" xml:space="preserve">
//             <path
//               d="M29.879 27.345c-.068-.107-.117-.227-.18-.336-.094-.164-.193-.326-.287-.49-.201-.354-.389-.713-.582-1.07-.398-.732-.836-1.439-1.219-2.182-.387-.754-.768-1.512-1.15-2.268-.398-.785-.85-1.541-1.281-2.311-.443-.789-.832-1.609-1.252-2.412-.408-.781-.818-1.564-1.219-2.35-.414-.812-.836-1.621-1.258-2.428-.432-.818-.877-1.629-1.291-2.459-.406-.816-.826-1.627-1.24-2.439a42.11 42.11 0 0 0-1.496-2.705.893.893 0 0 0-.696-.427.883.883 0 0 0-.255-.041.889.889 0 0 0-.229.03c-.23.064-.385.207-.518.398-.287.412-.561.83-.826 1.258-.217.35-.416.713-.641 1.057-.459.701-.977 1.361-1.391 2.092-.432.756-.885 1.5-1.328 2.25-.432.732-.816 1.49-1.238 2.229-.422.744-.875 1.471-1.311 2.207-.434.732-.822 1.488-1.25 2.225-.42.727-.836 1.457-1.268 2.176-.439.729-.844 1.475-1.27 2.213-.514.893-1.004 1.799-1.564 2.664-.254.395-.512.783-.758 1.182-.248.4-.498.803-.762 1.193-.162.24-.137.541-.012.791-.02.072-.043.143-.043.219 0 .215.086.424.238.576.162.162.352.217.576.238.848.076 1.701.064 2.553.08.867.014 1.734.004 2.602.016.818.01 1.637.021 2.457.027.842.004 1.684.041 2.525.031.842-.012 1.684-.045 2.525-.035.447.004.895.014 1.34.043.418.027.834.076 1.254.098.814.041 1.627.029 2.443.039.844.01 1.684.027 2.527.074.98.053 1.959.129 2.941.164.461.018.922.023 1.385.031.422.008.842.016 1.262-.018.23-.02.43-.08.598-.248.033-.033.05-.078.076-.115.065-.019.131-.029.193-.066.408-.236.572-.795.32-1.201zm-3.451-.069c-.812-.02-1.627-.09-2.441-.129-.404-.021-.811-.059-1.217-.072-.404-.014-.809-.021-1.215-.033-.844-.023-1.688-.031-2.533-.037-.848-.006-1.691-.098-2.537-.125a34.795 34.795 0 0 0-2.502.027c-.852.033-1.701.027-2.553.021a89.26 89.26 0 0 0-2.535.01c-1 .016-1.998.035-2.996.012a55.535 55.535 0 0 1-1.955-.08c.281-.451.56-.904.848-1.352.465-.723.881-1.469 1.287-2.225.801-1.486 1.672-2.934 2.52-4.393.439-.756.896-1.5 1.326-2.264.402-.711.85-1.396 1.273-2.094.443-.73.848-1.479 1.27-2.221.43-.758.883-1.504 1.33-2.252.256-.428.502-.861.748-1.295.254-.449.566-.865.859-1.291.275-.4.531-.814.791-1.225.096-.151.202-.296.3-.446.31.527.627 1.051.922 1.586.426.773.799 1.574 1.18 2.367.385.803.816 1.582 1.238 2.365.432.801.838 1.617 1.27 2.42.854 1.592 1.646 3.217 2.496 4.812.408.766.854 1.512 1.26 2.279.404.766.803 1.535 1.195 2.307.393.768.84 1.504 1.258 2.256.198.356.383.717.574 1.074-.487.005-.973.008-1.461-.002zm-9.46-8.758c.021.545.064 1.088.066 1.633a.846.846 0 0 1-.838.838c-.471 0-.818-.381-.838-.838-.021-.553-.035-1.105-.049-1.658a27.37 27.37 0 0 1-.006-1.695c.021-.555.055-1.109.07-1.666.016-.623.014-1.246.02-1.869a.777.777 0 0 1 .768-.766c.41 0 .773.348.766.766-.023 1.189-.057 2.377-.014 3.566.02.563.033 1.127.055 1.689zm.001 5.235c0 .451-.377.828-.828.828s-.828-.377-.828-.828.377-.828.828-.828.828.377.828.828z"
//               fill="#ffb400"
//             />
//           </svg>
//           <p class="warn">Время приблизительное, с возможной погрешностью, поэтому рекомендуется не откладывать все до последнего момента!</p>
//         </div>
//       </div>
//       <div class="right">
//         <img
//           src="${villager_images[`${user.villager[id].object_villager_type}_${user.villager[id].object_profession}`]}"
//           alt="none"
//         />
//       </div>
//     </div>
//   </body>
// </html>
// `;
// };
