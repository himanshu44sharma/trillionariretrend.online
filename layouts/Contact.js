import mailData from "@config/email.json";
import { markdownify } from "@lib/utils/textConverter";
import { useState } from "react";

const Contact = ({ data }) => {
  const { frontmatter } = data;
  const { title, info } = frontmatter;

  const [formData, setFormData] = useState({
    to: mailData.reciever_email,
    subject: '',
    text: '',
    cc: mailData.cc_email,
    bcc: mailData.bcc_email,
    name: '',
    email: ''
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { to, subject, text, cc, bcc, name, email } = formData;

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, text, cc, bcc, name, email }),
    });

    const data = await res.json();
    setIsLoading(false);
    if (res.status === 200) {
      // setMessage('Email sent successfully');
      setShowThankYou(true);
      // setTimeout(() => setShowThankYou(false), 3000); // Hide thank you popup after 3 seconds
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  const handleClosePopup = () => {
    setShowThankYou(false);
  };

  return (
    <section className="section">
      <div className="container">
        {markdownify(title, "h1", "text-center font-normal")}
        <div className="section row pb-0">
          <div className="col-12 md:col-6 lg:col-7">
            <form
              className="contact-form"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <input
                  className="form-input w-full rounded"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-input w-full rounded"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-input w-full rounded"
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-textarea w-full rounded-md"
                  name="text"
                  rows="7"
                  placeholder="Your message"
                  value={formData.text}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Now'}
              </button>
              {message && <p>{message}</p>}
            </form>
          </div>
          <div className="content col-12 md:col-6 lg:col-5">
            {markdownify(info.title, "h4")}
            {markdownify(info.description, "p", "mt-4")}
            <ul className="contact-list mt-5">
              {info.contacts.map((contact, index) => (
                <li key={index}>
                  {markdownify(contact, "strong", "text-dark")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showThankYou && (
        <div className="thank-you-popup">
          <div className="popup-content">
            <h2>Thank You!</h2>
            <p>Your message has been sent successfully.</p>
            <button className="close-btn" onClick={handleClosePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
