import CustomInput from "@/components/CustomInput";
import { toast } from "react-toastify";

const BusinessRegistrationForm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Business account created!");
  };

  return (
    <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <h2 className="text-lg font-semibold">Register a Business</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Set up your business profile, rewards, and team access.
      </p>
      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <CustomInput
          id="businessName"
          type="text"
          placeholder="Business name"
        />
        <CustomInput
          id="businessEmail"
          type="email"
          placeholder="Business email"
        />
        <div className="md:col-span-2">
          <CustomInput
            id="businessAddress"
            type="text"
            placeholder="Business address (optional)"
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="businessPassword"
            type="password"
            placeholder="Create password"
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="businessPasswordConfirm"
            type="password"
            placeholder="Confirm password"
          />
        </div>
        <button
          type="submit"
          className="md:col-span-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
        >
          Create Business Account
        </button>
      </form>
    </div>
  );
};

export default BusinessRegistrationForm;
