import React, { useState } from "react";

const VerifyEmailPage = () => {
  const [isSent, setIsSent] = useState(false);
  
  const reSendEmailVerification = () => {
    setIsSent(true);
  };
  return (
    <div>
      {isSent && (
        <p>
          E-Mail confirmation sent: Check you E-Mails (Spam folder included) for a confirmation E-Mail.
          Refresh this page once you confirmed your E-Mail.
        </p>
      )}
      {!isSent && (
        <p>
          Verify your E-Mail: Check you E-Mails (Spam folder included) for a confirmation E-Mail or send
          another confirmation E-Mail.
        </p>
      )}
      <button disabled={isSent} type='button' onClick={reSendEmailVerification}>
        Send confirmation E-Mail
      </button>
    </div>
  );
};

export default VerifyEmailPage;
