import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap"; // import {} from "gsap"
import { useGSAP } from "@gsap/react";
import { TextGenerateEffect } from "./text-generation-effect";
import { FlipWords } from "./flip-words";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

type Props = {};

const ScrollHero = (props: Props) => {
  useGSAP(() => {
    gsap.to(".heder__", {
      scrollTrigger: {
        trigger: ".heder__cont",
        pin: true,
        start: "-=60px top", // when the top of the trigger hits the top of the viewport
        scrub: 1.2, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        snap: "labels",
      },
      scale: 0.4,
      opacity: 0,
      ease: "power3.inOut",
    });

    gsap.to(".phone__fr", {
      scrollTrigger: {
        trigger: ".heder__cont",
        start: "-=60px top", // when the top of the trigger hits the top of the viewport
        scrub: 0.8, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
      scale: 0.76,
      top: "-60px",
      ease: "power3.inOut",
    });

    gsap.to(".phone__fr__header", {
      scrollTrigger: {
        trigger: ".heder__cont",
        start: "-=60px top", // when the top of the trigger hits the top of the viewport
        scrub: 1.2, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
      opacity: 1,
      ease: "power1.inOut",
    });

    gsap.to(".side_text", {
      scrollTrigger: {
        trigger: ".heder__cont",
        start: "-=60px top", // when the top of the trigger hits the top of the viewport
        scrub: 0.5, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
      opacity: 1,
      marginTop: -10,
      top: "-60px",
      delay: 2,
      ease: "power1.inOut",
    });

    gsap.to(".phone_fr_btns", {
      scrollTrigger: {
        trigger: ".heder__cont",
        start: "-=100px top", // when the top of the trigger hits the top of the viewport
        scrub: 3.2, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
      scale: 0.86,
      ease: "power1.inOut",
    });
  });

  return (
    <div className="heder__cont h-screen relative">
      <div className="grid gap-6 pt-12 heder__">
        <div className="flex align-middle place-items-center justify-between max-w-[9rem] mx-auto gap-1">
          <div>
            <svg
              width="14"
              height="26"
              viewBox="0 0 12 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.01404 2.82651C7.01054 2.50446 7.11029 2.17454 7.28004 1.86999C7.76304 1.00711 8.42017 0.335879 9.39754 0.0619617C10.0459 -0.120942 10.2918 0.0987175 10.1317 0.752443C9.84554 1.91812 9.12454 2.7565 8.05267 3.29034C7.86804 3.38222 7.65892 3.39535 7.45679 3.4041C7.13917 3.41548 7.00704 3.24308 7.01404 2.82651ZM9.33892 5.06861C8.91542 4.84895 8.46567 4.73693 8.16379 4.74043C7.24767 4.74043 6.58004 4.9741 5.96492 5.37053C5.80129 5.47467 5.65079 5.59807 5.54492 5.76697C5.35154 6.07764 5.41104 6.41544 5.70242 6.63685C5.82404 6.72962 5.96317 6.783 6.10754 6.82501C7.24067 7.15493 8.79117 6.61497 9.47279 5.65233C9.65217 5.39941 9.61367 5.21126 9.33892 5.06861ZM11.5798 23.2784C11.6979 22.9695 11.7373 22.6457 11.7434 22.2274L11.7373 22.1451C11.7301 22.0161 11.7158 21.8875 11.6944 21.7601C11.6788 21.6744 11.6636 21.5886 11.6489 21.5028C11.5745 21.074 11.5002 20.6451 11.3234 20.2435C11.2053 19.9774 11.0417 19.7508 10.7109 19.7245C10.2795 19.6895 10.0249 19.8846 9.89804 20.3887C9.64691 21.3463 9.70106 22.3584 10.0529 23.2837C10.2034 23.6845 10.4659 23.8788 10.8142 23.8761C11.1545 23.8726 11.4337 23.66 11.5798 23.2784ZM6.00167 24.8992C6.60542 25.4846 7.34829 25.7218 8.21454 25.7498C8.60654 25.7271 9.03704 25.6833 9.44479 25.5091C9.73879 25.3849 9.91204 25.1591 9.92079 24.8344C9.92772 24.6953 9.89228 24.5573 9.81917 24.4387C9.74606 24.3201 9.63871 24.2265 9.51129 24.1702C8.38167 23.6188 7.24504 23.4281 6.09704 24.1282C5.67179 24.3863 5.64379 24.5535 6.00079 24.8983L6.00167 24.8992ZM2.66004 18.8581C3.10017 18.9456 3.29354 18.7899 3.29004 18.2884V18.2858C3.28742 18.2604 3.28217 18.1913 3.27079 18.1221C3.08617 16.9494 1.63104 15.6192 0.445419 15.5379C0.210919 15.5221 0.0831688 15.6455 0.0236688 15.8564C-0.0139369 15.9945 -0.00658151 16.1411 0.0446688 16.2747C0.510169 17.5489 1.22242 18.5702 2.66004 18.8581ZM4.18867 18.1055C4.21492 16.7753 5.16342 15.4337 6.41117 14.9629C6.69817 14.8544 6.89242 14.9646 6.95979 15.2648C7.03154 15.5764 6.97904 15.8774 6.89854 16.1811C6.65354 17.1105 6.22829 17.9138 5.36729 18.4188C5.22303 18.5055 5.07064 18.5779 4.91229 18.635C4.39867 18.8196 4.17904 18.6542 4.18867 18.1055ZM3.15267 7.7369C3.17017 8.15171 3.05292 8.59103 2.83504 9.00584C2.63467 9.3909 2.44304 9.41891 2.11229 9.12224C1.55754 8.62691 1.26879 8.00031 1.17429 7.27133C1.11304 6.79438 1.14717 6.31655 1.18129 5.8396L1.18304 5.81598C1.22154 5.27777 1.47967 5.0301 1.90842 5.05461C2.17792 5.07036 2.33717 5.23751 2.47454 5.44317C2.81579 5.95075 3.15267 7.06129 3.15267 7.7369ZM3.57617 13.8235C3.43967 14.3573 3.59367 14.5498 4.18429 14.5376C4.41291 14.5395 4.63911 14.4908 4.84667 14.3949C5.96492 13.8786 6.64917 13.0061 6.95279 11.8203C7.00179 11.6277 6.92567 11.4912 6.74367 11.4177C6.61176 11.3643 6.46805 11.3468 6.32717 11.367C5.16867 11.5192 3.87017 12.6727 3.57617 13.8235ZM7.93804 21.3925C8.68704 20.7143 8.90842 19.84 8.87867 18.761C8.88288 18.4703 8.86121 18.1797 8.81392 17.8928C8.76929 17.6487 8.67392 17.4255 8.40267 17.3573C8.27441 17.3191 8.13787 17.3187 8.00939 17.3561C7.8809 17.3935 7.76591 17.4671 7.67817 17.5682C7.57072 17.6867 7.48298 17.8218 7.41829 17.9681C7.21442 18.41 7.03679 18.8634 6.95454 19.3464C6.84342 19.9984 6.89242 20.6329 7.17329 21.2411C7.37454 21.6769 7.57842 21.7181 7.93804 21.3925ZM3.39242 3.18182C3.37492 2.37845 3.68554 1.68534 4.10992 1.02724C4.20267 0.884588 4.26567 0.904717 4.36454 1.02461C5.38654 2.2603 5.60179 3.60888 4.94204 5.08349C4.85104 5.28739 4.73117 5.4598 4.49054 5.48255C4.23417 5.50705 4.08629 5.33378 3.96204 5.14475C3.59122 4.55715 3.39318 3.87667 3.39242 3.18182ZM3.93579 10.1873C4.23417 10.2748 4.53779 10.3317 4.89304 10.3264C5.96929 10.3352 6.75679 9.70945 7.43579 8.92008C7.73854 8.5639 7.50579 8.11321 7.03592 8.0922L6.79879 8.0782C6.47504 8.05895 6.14954 8.03882 5.82142 8.0922C4.89392 8.2436 4.16942 8.69167 3.67154 9.48979C3.44842 9.8486 3.53679 10.0718 3.93579 10.1873ZM2.94092 21.4503C3.50442 22.1696 4.20967 22.6229 5.21067 22.6107C5.35067 22.6238 5.51167 22.6011 5.68142 22.5757C5.76104 22.5652 5.84329 22.5529 5.92467 22.5451C6.14954 22.5241 6.33417 22.4365 6.43042 22.2151C6.52754 21.9902 6.45667 21.7951 6.30967 21.6262C5.41717 20.5979 4.33567 20.0991 2.95667 20.4272C2.38967 20.5629 2.38704 20.5638 2.69242 21.074C2.76854 21.2026 2.84904 21.3312 2.94092 21.4503ZM2.57254 13.4647C2.56467 13.5933 2.56379 13.7036 2.56204 13.7963C2.55504 14.2672 2.55417 14.282 1.87079 13.9836C0.719294 13.4795 -0.0314562 12.2718 0.00704377 11.0379C0.0297938 10.3203 0.276544 10.1715 0.900419 10.5198C2.08079 11.1823 2.54717 12.2421 2.57167 13.4638L2.57254 13.4647Z"
                fill="#333333"
              />
            </svg>
          </div>
          <div className="grid place-items-center align-middle justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5.94937C9 8.199 7.46875 9.32381 5.64875 9.9762C5.55345 10.0094 5.44992 10.0078 5.35563 9.9717C3.53125 9.32381 2 8.199 2 5.94937V2.7999C2 2.68057 2.04609 2.56613 2.12814 2.48176C2.21019 2.39738 2.32147 2.34998 2.4375 2.34998C3.3125 2.34998 4.40625 1.81007 5.1675 1.12618C5.26019 1.04474 5.37809 1 5.5 1C5.62191 1 5.73981 1.04474 5.8325 1.12618C6.59812 1.81457 7.6875 2.34998 8.5625 2.34998C8.67853 2.34998 8.78981 2.39738 8.87186 2.48176C8.95391 2.56613 9 2.68057 9 2.7999V5.94937Z"
                fill="#333333"
              />
              <path
                d="M4 6L5 7L7 5"
                stroke="white"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h4 className="font-semibold mb-1.5 text-xs">Fast & Reliable</h4>
          </div>
          <div>
            <svg
              width="14"
              height="26"
              viewBox="0 0 12 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.83867 0.52355C1.83342 0.100859 1.95329 -0.0172837 2.37504 0.00196931C2.85979 0.0247228 3.25004 0.26801 3.60879 0.561181C4.26417 1.09501 4.81629 1.70936 5.00004 2.56874C5.15491 3.29773 4.85829 3.56814 4.14604 3.33448C3.35679 3.07457 2.79853 2.51011 2.33828 1.84063C1.98828 1.32955 1.84392 0.931363 1.83867 0.52355ZM5.08054 6.90066C4.05504 6.87441 3.23429 6.46134 2.58854 5.69997C2.33391 5.3998 2.39079 5.17314 2.75216 5.01299C3.58516 4.64544 4.42866 4.60518 5.27216 4.97449C5.63616 5.13464 5.98791 5.32279 6.29679 5.57921C6.51641 5.76298 6.63454 5.98877 6.57504 6.27931C6.51817 6.55936 6.29854 6.67575 6.05617 6.75714C5.79629 6.8429 5.52679 6.8639 5.26779 6.88491C5.20529 6.88918 5.14287 6.89443 5.08054 6.90066ZM3.72779 25.7519C3.33404 25.7484 2.94904 25.7029 2.59292 25.52C2.31292 25.3756 2.13529 25.1595 2.12304 24.8348C2.11254 24.511 2.27441 24.2773 2.54654 24.1207C2.68391 24.0419 2.83004 23.9702 2.97967 23.9273C3.68054 23.7234 4.39191 23.6035 5.12516 23.7085C5.30103 23.7348 5.47342 23.7785 5.63267 23.8573C6.22504 24.1513 6.27753 24.9031 5.70878 25.2444C5.10591 25.6102 4.42341 25.7169 3.72779 25.7519ZM7.86304 14.5327C7.62592 14.545 7.36954 14.4785 7.12716 14.3638C6.30916 13.9824 5.64887 13.3288 5.25904 12.5147C5.15743 12.3168 5.09701 12.1003 5.08141 11.8784C5.06216 11.5126 5.17067 11.3936 5.52942 11.3796C5.79593 11.3682 6.06156 11.4173 6.30641 11.5231C7.16202 11.886 7.86633 12.533 8.30054 13.3548C8.38017 13.5044 8.43091 13.6646 8.46766 13.8291C8.58228 14.3516 8.42917 14.5397 7.86304 14.5327ZM1.88241 23.4355C2.10553 22.8553 2.23241 22.2523 2.27791 21.806C2.29541 21.0113 2.09328 20.4495 1.79141 19.9183C1.57178 19.5297 1.37841 19.507 1.08091 19.8325C0.197165 20.7987 0.146412 22.4474 0.547162 23.4381C0.666162 23.7304 0.88579 23.9133 1.21829 23.915C1.55429 23.9168 1.76866 23.7295 1.88241 23.4355ZM10.8932 6.60049C10.9124 7.58502 10.6394 8.4514 9.87903 9.12088C9.54828 9.41142 9.31816 9.36592 9.14229 8.9686C8.78266 8.15298 8.75379 7.3251 9.07579 6.49022L9.10641 6.41146C9.22979 6.09116 9.35404 5.76911 9.53604 5.47594C9.69441 5.22215 9.87904 4.98849 10.2264 5.03312C10.5362 5.07338 10.7383 5.30879 10.8153 5.70085C10.8757 5.99752 10.8897 6.29857 10.8932 6.60049ZM10.5257 13.907C11.5625 13.2008 11.9213 12.1532 12 10.9508L11.9974 10.9123L11.9965 10.8834C11.986 10.6944 11.9755 10.4913 11.7734 10.3793C11.5573 10.2603 11.3587 10.3723 11.1775 10.4843C10.5589 10.8668 10.0444 11.3533 9.71716 12.0176C9.44504 12.5698 9.37242 13.164 9.36017 13.7678C9.35142 14.1888 9.58854 14.3341 9.98929 14.1905C10.1809 14.1232 10.3568 14.0216 10.5257 13.907ZM8.71704 18.3396C8.68204 18.7106 8.82378 18.8743 9.20353 18.876L9.23766 18.8734C9.27266 18.8699 9.32254 18.8655 9.37066 18.8568C10.5642 18.6642 11.8067 17.3638 11.9493 16.1613C12.014 15.6223 11.8714 15.4814 11.3342 15.5697C10.4942 15.7098 9.90529 16.241 9.38641 16.8615C9.02941 17.2868 8.77304 17.7716 8.71704 18.3396ZM5.09366 19.8903C5.05516 20.0627 5.05079 20.2438 5.04554 20.4276C5.04029 20.6254 5.03504 20.8267 4.98779 21.0253C4.86704 21.5215 4.32191 21.6992 3.93341 21.3666C3.75412 21.207 3.61451 21.0077 3.52566 20.7847C3.13804 19.8798 2.91579 18.9556 3.23779 17.9781C3.29554 17.8031 3.36991 17.6316 3.45566 17.4679C3.60354 17.1887 3.79691 17.1572 4.03054 17.3717C4.59054 17.8847 4.94738 18.582 5.03591 19.3363C5.05078 19.4518 5.06216 19.5656 5.07354 19.6864L5.09366 19.8903ZM6.89179 18.5408C7.50779 18.8708 7.78079 18.6669 7.75804 17.9151C7.76854 17.5336 7.64341 17.1292 7.44829 16.7477C7.08254 16.0353 6.61704 15.4043 5.86716 15.0552C5.27654 14.7821 4.94578 14.9808 5.00528 15.624C5.12166 16.9113 5.73854 17.9221 6.89179 18.5408ZM6.46654 22.5883L6.65729 22.6058C7.91904 22.6023 8.83866 22.0738 9.45729 21.0262C9.63579 20.7252 9.56228 20.5353 9.23153 20.4486C7.76766 20.0574 6.55229 20.5738 5.65366 21.6913C5.36929 22.0431 5.56091 22.4702 6.01241 22.5402C6.16641 22.563 6.32392 22.5761 6.46654 22.5883ZM5.49091 8.04446C6.66166 8.03746 7.63991 8.42515 8.31103 9.43418C8.59278 9.85949 8.51841 10.0686 8.02841 10.2025C7.11141 10.4555 6.25566 10.3294 5.48041 9.76673C5.2328 9.58121 4.99506 9.38287 4.76816 9.17251C4.53279 8.9616 4.41729 8.69469 4.53454 8.38489C4.64654 8.08734 4.92479 8.06634 5.19079 8.04534H5.19866C5.26341 8.04009 5.32816 8.04184 5.39378 8.04359L5.49091 8.04446ZM8.61203 3.23647C8.64003 3.88144 8.41516 4.48791 8.07916 5.06113C8.04766 5.11538 8.01266 5.16614 7.97416 5.21515C7.67316 5.59846 7.35904 5.57571 7.12891 5.14864C6.99337 4.87978 6.89336 4.59442 6.83141 4.29976C6.53654 3.06932 6.84016 1.99378 7.66091 1.04776C7.76853 0.921736 7.83679 0.909484 7.94092 1.05826C8.34342 1.63497 8.61203 2.46898 8.61203 3.23647Z"
                fill="#333333"
              />
            </svg>
          </div>
        </div>
        <div className="text-center text-zinc-800 text-4xl md:text-5xl font-extrabold font-['Inter'] leading-[48.40px] max-w-[90vw] md:max-w-[30rem] mx-auto place-items-center">
          <div className="grid grid-rows-3 gap-0 -space-y-1 h-[10rem] md:h-[13rem]">
            <div className="h-full">Sell Your</div>
            <div className="h-full">
              <FlipWords words={["Gift cards", "Cryptocurrencies"]} />
            </div>
            <div className="h-full">for Instant Cash</div>
          </div>

          <Link href="/sell">
            <Button className="md:w-[26vw] p-6 w-full mb-8 md:mb-20 rounded-full text-base mx-auto mt-4 md:mt-0">
              Trade a giftcard
            </Button>
          </Link>
        </div>
      </div>
      <div className="phone__fr__header opacity-0 absolute top-14 left-1/2 -translate-x-1/2 w-full px-8 md:hidden">
        <h4 className="text-[1.2rem] text-center font-bold">
          We make selling your giftcard simple.
        </h4>
      </div>
      <div className="grid place-items-center phone__fr absolute left-1/2 -translate-x-1/2 w-full scale-[1] md:grid-flow-col grid-flow-row md:grid-cols-3 md:grid-rows-none md:gap-8 grid-rows-2 gap-4 md:px-4 px-0 pt-4">
        <div className="side_text md:mt-64 mt-80 opacity-0 hidden md:block">
          <h4 className="md:text-[2.8rem] text-[1.8rem] font-black text-left ">
            We make selling your giftcard simple.
          </h4>
        </div>
        <div
          style={{
            backgroundImage: `url("/phone_frame.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "110%",
            backgroundPosition: "center center",
            backgroundClip: "content-box",
          }}
          className="md:w-[399px] md:h-[786px] w-[369px] h-[686px] text-2xl font-bold"
        >
          <Image
            src={"/dets_scn.png"}
            alt=""
            width={1050}
            height={2277}
            className="md:mt-[4.6rem] mt-[3rem] md:w-[75%] w-[76%] rounded-[42px] mx-auto max-h-[76.8%]"
          />
        </div>
        <div className="side_text md:mt-64 md:opacity-0 mt-0 mb-16 md:mb-0 self-start md:self-center">
          <TextGenerateEffect words="So you don't have to hassle." />
        </div>
      </div>
    </div>
  );
};

export default ScrollHero;
