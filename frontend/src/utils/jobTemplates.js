export const generateJobDescription = (title, skills, company) => {
    const today = new Date().toLocaleDateString();

    return `**Job Title:** ${title}
**Company:** ${company}
**Date:** ${today}

**About Us:**
${company} is a leading innovator in the industry. We are looking for a talented ${title} to join our dynamic team.

**Role Overview:**
As a ${title}, you will be responsible for developing high-quality solutions and contributing to our core products. You will work closely with cross-functional teams to deliver exceptional user experiences.

**Key Responsibilities:**
- Design, develop, and maintain efficient, reusable, and reliable code.
- Collaborate with product managers and designers to define requirements.
- Troubleshoot and debug applications to ensure optimal performance.
- Participate in code reviews and contribute to engineering best practices.

**Required Skills:**
${skills ? skills.split(',').map(s => `- ${s.trim()}`).join('\n') : '- Relevant technical skills'}

**Why Join Us?**
- Competitive salary and benefits package.
- Flexible working hours and remote options.
- Opportunity to work with cutting-edge technologies.
- Collaborative and inclusive work environment.

**How to Apply:**
If you are passionate about technology and ready to make an impact, please submit your application with your resume and portfolio.
`;
};
