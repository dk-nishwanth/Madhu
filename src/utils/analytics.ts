// Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Portfolio Interaction',
      event_label: eventName,
      ...parameters
    });
  }
};

export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};

export const trackProjectView = (projectName: string) => {
  trackEvent('project_viewed', {
    project_name: projectName,
    event_category: 'Project Engagement'
  });
};

export const trackContactFormSubmit = () => {
  trackEvent('contact_form_submit', {
    event_category: 'Lead Generation'
  });
};

export const trackSectionView = (sectionName: string) => {
  trackEvent('section_viewed', {
    section_name: sectionName,
    event_category: 'Navigation'
  });
};

export const trackDownload = (fileName: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    event_category: 'Downloads'
  });
};

export const trackExternalLink = (linkName: string, url: string) => {
  trackEvent('external_link_click', {
    link_name: linkName,
    link_url: url,
    event_category: 'External Navigation'
  });
};