import ContactForm from "./ContactForm";

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-transparent text-contrast">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Contact
          </p>
          <h1 className="text-3xl font-semibold text-brand">Get in touch</h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            Send us your question, feedback, or support request and we will get
            back to you as soon as possible.
          </p>
        </header>

        <div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
