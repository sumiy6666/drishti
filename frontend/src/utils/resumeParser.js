import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const parseResume = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return extractDataFromText(fullText);
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF');
    }
};

const extractDataFromText = (text) => {
    const data = {
        email: '',
        phone: '',
        links: [],
        skills: '',
        experience: '',
        education: '',
        summary: '',
    };

    // Email
    const emailMatch = text.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/);
    if (emailMatch) data.email = emailMatch[0];

    // Phone (Basic regex for various formats)
    const phoneMatch = text.match(/(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
    if (phoneMatch) data.phone = phoneMatch[0];

    // Links (LinkedIn, GitHub, Portfolio)
    const linkMatches = text.match(/(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/[\w-]+|github\.com\/[\w-]+|[\w-]+\.com)/gi);
    if (linkMatches) data.links = [...new Set(linkMatches)]; // Remove duplicates

    // Simple heuristic segmentation based on common headers
    // This is not perfect but better than nothing
    const lowerText = text.toLowerCase();

    const skillsIndex = lowerText.indexOf('skills');
    const expIndex = lowerText.indexOf('experience') !== -1 ? lowerText.indexOf('experience') : lowerText.indexOf('work history');
    const eduIndex = lowerText.indexOf('education');
    const summaryIndex = lowerText.indexOf('summary') !== -1 ? lowerText.indexOf('summary') : lowerText.indexOf('profile');

    // Extract Skills
    if (skillsIndex !== -1) {
        // Find the next section to stop extraction
        const nextIndices = [expIndex, eduIndex, summaryIndex].filter(i => i > skillsIndex).sort((a, b) => a - b);
        const endIndex = nextIndices.length > 0 ? nextIndices[0] : text.length;
        data.skills = text.substring(skillsIndex + 6, endIndex).trim().slice(0, 500); // Limit length
    }

    // Extract Experience
    if (expIndex !== -1) {
        const nextIndices = [skillsIndex, eduIndex, summaryIndex].filter(i => i > expIndex).sort((a, b) => a - b);
        const endIndex = nextIndices.length > 0 ? nextIndices[0] : text.length;
        data.experience = text.substring(expIndex + 10, endIndex).trim();
    }

    // Extract Education
    if (eduIndex !== -1) {
        const nextIndices = [skillsIndex, expIndex, summaryIndex].filter(i => i > eduIndex).sort((a, b) => a - b);
        const endIndex = nextIndices.length > 0 ? nextIndices[0] : text.length;
        data.education = text.substring(eduIndex + 9, endIndex).trim();
    }

    // Extract Summary (if at start or explicit header)
    if (summaryIndex !== -1) {
        const nextIndices = [skillsIndex, expIndex, eduIndex].filter(i => i > summaryIndex).sort((a, b) => a - b);
        const endIndex = nextIndices.length > 0 ? nextIndices[0] : text.length;
        data.summary = text.substring(summaryIndex + 7, endIndex).trim();
    }

    return data;
};
