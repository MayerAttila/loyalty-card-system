const FaqSection = () => {
  const faqs = [
    {
      question: "How fast can I launch?",
      answer: "Most businesses set up their card in under 15 minutes.",
    },
    {
      question: "Do I need special hardware?",
      answer: "No. Any phone or tablet can scan QR codes and stamp cards.",
    },
    {
      question: "What do customers need?",
      answer: "Just their phone to save the card and show the QR code.",
    },
    {
      question: "Can I customize stamps and rewards?",
      answer: "Yes. You control stamp count, reward rules, and visuals.",
    },
    {
      question: "Can I invite staff?",
      answer: "Yes. Add team members and manage roles anytime.",
    },
    {
      question: "Does it work with Google Wallet?",
      answer: "Yes. Customers can save their card directly to Google Wallet.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel at the end of your billing period from Stripe.",
    },
    {
      question: "Do you offer annual pricing?",
      answer: "Yes. Annual plans are discounted compared to monthly.",
    },
  ];

  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-accent-3 bg-accent-1 p-8">
        <h2 className="text-2xl font-semibold text-contrast">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-accent-3 bg-primary/40 p-4"
            >
              <p className="text-sm font-semibold text-contrast">
                {faq.question}
              </p>
              <p className="mt-2 text-xs text-contrast/70">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
