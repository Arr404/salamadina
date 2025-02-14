export default function Page() {
  return (
    <div
      className="z-50 min-h-screen w-screen bg-gradient-to-br from-[#901D57] to-[#B71E7E] flex items-center justify-center"
      style={{
        backgroundSize: "200% 200%",
        animation: "gradientMove 2s infinite alternate",
      }}
    >
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
        `}
      </style>
      <div className="relative w-full h-full">
        <div
          className="w-40 h-[15rem]  overflow-hidden relative transform translate-x-[28vw] md:translate-x-[32vw] xl:translate-x-[44vw]">

          {[{ number: -1, animation: "animate-bounce0" },
            { number: 0, animation: "animate-bounce1" },
            { number: 1, animation: "animate-bounce2" }].map(
            (item) => (
              <svg
                key={item.number}
                className={`translate-y-[240px] absolute mt-12 top-[${31.704 * item.number}px] left-[${-19.976 * item.number}px] w-40 h-40 scale-100 ${item.animation} `}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 76.48568 198.18012"
              >
                <defs>
                  <style>
                    {`.cls-1 { fill: #fff; }`}
                  </style>
                </defs>
                <path className="cls-1"
                      d="M328.28152,495.50731c.12731-.922.25258-1.84433.38229-2.766a75.18589,75.18589,0,0,0,.66387-8.8455,88.17027,88.17027,0,0,0-.39458-10.772c-1.40907-13.99447-5.4405-27.10744-13.16483-38.97061a82.8611,82.8611,0,0,0-8.95853-11.19288q-6.56045-7.041-13.22635-13.98338a97.85875,97.85875,0,0,1-16.77389-23.36825,82.52142,82.52142,0,0,1-8.06537-24.46822,84.43978,84.43978,0,0,1-.731-18.451,85.93507,85.93507,0,0,1,3.12919-18.6059,89.46479,89.46479,0,0,1,11.58432-24.67582,15.04714,15.04714,0,0,1,1.50413-1.99778c-.10718.68853-.211,1.3776-.32207,2.0655a84.48838,84.48838,0,0,0-.97136,16.3746,88.13431,88.13431,0,0,0,8.69088,36.00507A56.62615,56.62615,0,0,0,300.838,365.587c6.99007,7.58633,13.9648,15.1871,20.9975,22.73372a84.807,84.807,0,0,1,15.18,22.9292A82.42076,82.42076,0,0,1,343.0733,430.407a65.91375,65.91375,0,0,1,1.22921,12.77518c-.02245,1.964.04682,3.93124-.04094,5.89183-.09265,2.06969-.26321,4.14022-.505,6.198a93.84929,93.84929,0,0,1-2.60883,13.58213,79.20753,79.20753,0,0,1-9.39348,22.0317c-1.02015,1.60515-2.15375,3.13809-3.23515,4.70427Z"
                      transform="translate(-267.8218 -297.40994)" />
              </svg>
            ))}
        </div>
      </div>

      <style>{`
  .animate-bounce0 {
    animation: bounce2 3s infinite;
    transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    animation-delay: 0.2s;
  }
  .animate-bounce1 {
    animation: bounce2 3s infinite;
    transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    animation-delay: 0.4s;
  }
  .animate-bounce2 {
    animation: bounce2 3s infinite;
    transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    animation-delay: 0.6s;
  }
  @keyframes bounce2 {
    0% { transform: translateY(240px); }
    20% { transform: translateY(-15px); }
    50% { transform: translateY(0); }
    65% { transform: translateY(0); }
    80% { transform: translateY(240px); }
    100% { transform: translateY(240px); }
  }
`}</style>
    </div>
  )
}
