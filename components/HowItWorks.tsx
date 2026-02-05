import { FiUserPlus, FiEdit3, FiUsers, FiGift } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineQrcode } from "react-icons/hi";

const steps = [
  {
    title: "Create your account",
    description: "Sign up and set up your loyalty program in minutes.",
    icon: <FiUserPlus className="h-10 w-10 text-brand" />,
  },
  {
    title: "Customize your card",
    description: "Add your logo, stamps, rewards, and brand colors.",
    icon: <FaRegCreditCard className="h-10 w-10 text-brand" />,
  },
  {
    title: "Invite your staff",
    description: "Add team members so they can scan and stamp cards.",
    icon: <FiUsers className="h-10 w-10 text-brand" />,
  },
  {
    title: "Share the QR code",
    description: "Customers scan and instantly get their digital card.",
    icon: <HiOutlineQrcode className="h-10 w-10 text-brand" />,
  },
  {
    title: "Start stamping",
    description: "Scan customer QR codes and reward loyalty instantly.",
    icon: <FaRegCheckCircle className="h-10 w-10 text-brand" />,
  },
  {
    title: "Reward customers",
    description: "Celebrate redemptions and keep customers coming back.",
    icon: <FiGift className="h-10 w-10 text-brand" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-accent-3 bg-accent-2 p-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-contrast">How it works</h2>
          <p className="mt-2 text-sm text-contrast/80">
            A simple flow your team and customers can follow in minutes.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[260px] -translate-x-1/2 md:block">
            <svg
              aria-hidden="true"
              viewBox="0 0 260 760"
              className="h-full w-full"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="howitworks-gradient"
                  x1="130"
                  y1="0"
                  x2="130"
                  y2="760"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#e6345a" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#e6345a" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <path
                d="M130 20 C240 110, 230 220, 130 300 S30 480, 140 560 S240 690, 130 740"
                stroke="url(#howitworks-gradient)"
                strokeWidth="8"
                strokeDasharray="14 28"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>

          <div className="grid gap-16">
            {steps.map((step, index) => {
              const offsetClass =
                index % 3 === 0
                  ? "md:-translate-x-24"
                  : index % 3 === 1
                  ? "md:translate-x-20"
                  : "md:-translate-x-6";

              return (
                <div
                  key={step.title}
                className={`mx-auto flex w-full max-w-full rounded-2xl border border-accent-3 bg-accent-1 p-6 shadow-[0_16px_35px_-25px_rgba(0,0,0,0.6)] transition-transform md:inline-flex md:w-fit md:min-w-[520px] md:max-w-[760px] ${offsetClass}`}
              >
                  <div className="absolute right-5 top-4 text-3xl font-semibold text-brand/80 md:block hidden">
                    {index + 1}
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    <div className="flex items-center justify-center">
                      {step.icon}
                    </div>
                  <div>
                    <p className="text-lg font-semibold text-contrast md:text-left text-center">
                      {step.title}
                    </p>
                    <p className="mt-2 text-base text-contrast/75 md:text-left text-center">
                      {step.description}
                    </p>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
