
import React from 'react';

interface PrivacyPolicyProps {
  content: string;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
      <h3 className="text-[#1a1a1a] font-black uppercase text-xl mb-4">Industrial Data Privacy Commitment</h3>
      <div className="whitespace-pre-line">
        {content}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
