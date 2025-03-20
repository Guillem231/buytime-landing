import React, { useRef, useState } from 'react';
import KinectBackground from '../KinectBackground';
import TermsNav from './components/TermsNav';
import TermsSection from './components/TermsSection';
import useAnimations from '../../utils/privacyTermsAnimations';
import styles from './styles/TermsOfService.module.css';

const TermsOfService = () => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('introduction');
  
  useAnimations(textContainerRef);
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };
  
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'eligibility', title: 'Eligibility' },
    { id: 'accounts', title: 'User Accounts' },
    { id: 'services', title: 'Services' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'prohibited', title: 'Prohibited Activities' },
    { id: 'disclaimer', title: 'Disclaimers' },
    { id: 'limitation', title: 'Limitation of Liability' },
    { id: 'termination', title: 'Termination' },
    { id: 'governing-law', title: 'Governing Law' },
    { id: 'changes', title: 'Changes to Terms' }
  ];
  
  return (
    <div className={styles.termsOfServicePage} ref={containerRef}>
      <KinectBackground showGUI={false} />      
      <div className={styles.termsContent} ref={textContainerRef}>
        <div className={styles.headerContainer}>
          <h1 className={styles.termsTitle}>Terms of Service</h1>
          <p className={styles.updatedDate}>Last Updated: March 2025</p>
          <div className={styles.titleSeparator}></div>
        </div>
        
        <div className={styles.termsLayout}>
          <TermsNav 
            sections={sections} 
            activeSection={activeSection} 
            scrollToSection={scrollToSection} 
          />
          
          <div className={styles.termsText}>
            <TermsSection 
              id="introduction"
              title="Introduction"
              content={
                <>
                  <p>
                    Welcome to Aikron! These Terms of Service ("Terms") govern your access to and use of 
                    the Aikron website, services, and applications (collectively, the "Services").
                  </p>
                  <p>
                    Please read these Terms carefully before using our Services. By accessing or using our Services, 
                    you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, 
                    please do not use our Services.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="acceptance"
              title="Acceptance of Terms"
              content={
                <>
                  <p>
                    By creating an account, accessing, or using our Services, you acknowledge that you have read, 
                    understood, and agree to be bound by these Terms. If you are using the Services on behalf of 
                    a company, organization, or other entity, then "you" means you and such entity, and you represent 
                    and warrant that you are an authorized representative of the entity with the authority to bind the 
                    entity to these Terms.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="eligibility"
              title="Eligibility"
              content={
                <>
                  <p>
                    You must be at least 18 years old to use our Services. By using our Services, you represent and 
                    warrant that you meet all eligibility requirements we outline in these Terms. We may still provide 
                    the Services to you if you are between 13 and 18 years old, but only if you have consent from your 
                    parent or legal guardian.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="accounts"
              title="User Accounts"
              content={
                <>
                  <p>
                    When you create an account with us, you guarantee that the information you provide is accurate, 
                    complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in 
                    the immediate termination of your account.
                  </p>
                  <p>
                    You are responsible for maintaining the confidentiality of your account and password, including but 
                    not limited to restricting access to your computer and/or account. You agree to accept responsibility 
                    for any and all activities or actions that occur under your account and/or password.
                  </p>
                  <p>
                    You must notify us immediately upon becoming aware of any breach of security or unauthorized use 
                    of your account.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="services"
              title="Services"
              content={
                <>
                  <p>
                    Aikron provides a platform that allows users to trade time-based services. Our Services are subject to 
                    change without notice. We reserve the right to modify, suspend, or discontinue the Services at any time, 
                    without notice or liability to you.
                  </p>
                  <p>
                    We make no guarantee that our Services will be available at all times. We may experience hardware, software, 
                    or other technical issues that may temporarily or permanently disable access to certain features or 
                    functionalities of our Services.
                  </p>
                  <p>
                    We reserve the right to refuse to provide the Services to any user for any reason at any time.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="intellectual-property"
              title="Intellectual Property"
              content={
                <>
                  <p>
                    The Services and its original content, features, and functionality are and will remain the exclusive property 
                    of Aikron and its licensors. The Services are protected by copyright, trademark, and other laws of both the 
                    United States and foreign countries.
                  </p>
                  <p>
                    Our trademarks and trade dress may not be used in connection with any product or service without the prior 
                    written consent of Aikron.
                  </p>
                  <p>
                    You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Services, use of the 
                    Services, or access to the Services without express written permission from us.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="prohibited"
              title="Prohibited Activities"
              content={
                <>
                  <p>
                    You may use our Services only for lawful purposes and in accordance with these Terms. You agree not to use our Services:
                  </p>
                  <ul>
                    <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                    <li>To exploit, harm, or attempt to exploit or harm minors in any way.</li>
                    <li>To transmit any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, 
                        hateful, inflammatory, or otherwise objectionable.</li>
                    <li>To impersonate or attempt to impersonate Aikron, a Aikron employee, another user, or any other person or entity.</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services.</li>
                    <li>To attempt to bypass any security measures or features on our platform.</li>
                    <li>To use any robot, spider, or other automatic device, process, or means to access the Services for any purpose.</li>
                  </ul>
                  <p>
                    We have the right to terminate your access to our Services for violating any of these prohibited activities.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="disclaimer"
              title="Disclaimers"
              content={
                <>
                  <p>
                    YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. 
                    Aikron EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO 
                    THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p>
                    AIKRON MAKES NO WARRANTY THAT (i) THE SERVICES WILL MEET YOUR REQUIREMENTS, (ii) THE SERVICES WILL BE UNINTERRUPTED, 
                    TIMELY, SECURE, OR ERROR-FREE, (iii) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICES WILL BE ACCURATE 
                    OR RELIABLE, OR (iv) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED 
                    BY YOU THROUGH THE SERVICES WILL MEET YOUR EXPECTATIONS.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="limitation"
              title="Limitation of Liability"
              content={
                <>
                  <p>
                    IN NO EVENT SHALL AIKRON, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, 
                    INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING FROM (i) ERRORS, 
                    MISTAKES, OR INACCURACIES OF CONTENT, (ii) PERSONAL INJURY OR PROPERTY DAMAGE, (iii) UNAUTHORIZED ACCESS TO 
                    OR USE OF OUR SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN, (iv) INTERRUPTION OR CESSATION OF 
                    TRANSMISSION TO OR FROM OUR SERVICES, (v) BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE TRANSMITTED TO OR THROUGH 
                    OUR SERVICES, AND/OR (vi) ANY ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED 
                    AS A RESULT OF YOUR USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES, WHETHER 
                    BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.
                  </p>
                  <p>
                    THE FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW IN THE APPLICABLE JURISDICTION.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="termination"
              title="Termination"
              content={
                <>
                  <p>
                    We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, 
                    under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of 
                    the Terms.
                  </p>
                  <p>
                    If you wish to terminate your account, you may simply discontinue using the Services or contact us to deactivate 
                    your account.
                  </p>
                  <p>
                    All provisions of the Terms which by their nature should survive termination shall survive termination, including, 
                    without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="governing-law"
              title="Governing Law"
              content={
                <>
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to 
                    its conflict of law provisions.
                  </p>
                  <p>
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If 
                    any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these 
                    Terms will remain in effect.
                  </p>
                  <p>
                    These Terms constitute the entire agreement between us regarding our Services, and supersede and replace any prior 
                    agreements we might have had between us regarding the Services.
                  </p>
                </>
              }
            />
            
            <TermsSection 
              id="changes"
              title="Changes to Terms"
              content={
                <>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material 
                    we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will 
                    be determined at our sole discretion.
                  </p>
                  <p>
                    By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised 
                    terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
                  </p>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
