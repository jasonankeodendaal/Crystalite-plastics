
export const getMaterialRecommendation = async (userApplication: string) => {
  return `### Technical Material Recommendation\n\nBased on your application requirement: "${userApplication}", please consult with our Senior Technical Specialists at the Isando HQ. \n\nIndustrial polymers require precise environmental evaluation (Heat, Chemicals, Load) which is best handled by our engineering team to ensure ISO compliance and safety standards.\n\n**Contact Central HQ: +27 11 555 0100**`;
};

export const summarizeInquiry = async (message: string) => {
  return "Technical digest pending review by distribution officer.";
};
