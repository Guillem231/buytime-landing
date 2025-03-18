import React, { useRef, useState } from 'react';
import KinectBackground from '../KinectBackground';
import PolicyNav from './components/PolicyNav';
import PolicySection from './components/PolicySection';
import useAnimations from '../../utils/privacyTermsAnimations';
import styles from './styles/PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
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
    { id: 'information-collection', title: 'Information Collection' },
    { id: 'information-usage', title: 'How We Use Your Information' },
    { id: 'information-sharing', title: 'Information Sharing' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'user-rights', title: 'Your Rights' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'changes', title: 'Changes to Policy' }
  ];
  
  return (
    <div className={styles.privacyPolicyPage} ref={containerRef}>
      <KinectBackground showGUI={false} />
      
      <div className={styles.policyContent} ref={textContainerRef}>
        <div className={styles.headerContainer}>
          <h1 className={styles.policyTitle}>Privacy Policy</h1>
          <p className={styles.updatedDate}>Last Updated: March 2025</p>
          <div className={styles.titleSeparator}></div>
        </div>
        
        <div className={styles.policyLayout}>
          <PolicyNav 
            sections={sections} 
            activeSection={activeSection} 
            scrollToSection={scrollToSection} 
          />
          
          <div className={styles.policyText}>
            <PolicySection 
              id="introduction"
              title="Introduction"
              content={
                <>
                  <p>
                    At BuyTimeApp, we respect your privacy and are committed to protecting your personal data. 
                    This Privacy Policy will inform you about how we look after your personal data when you 
                    visit our website and tell you about your privacy rights and how the law protects you.
                  </p>
                  <p>
                    Please read this Privacy Policy carefully to understand our policies and practices 
                    regarding your personal data and how we will treat it. If you do not agree with our 
                    policies and practices, please do not use our website.
                  </p>
                </>
              }
            />
            
            <PolicySection 
              id="information-collection"
              title="Information Collection"
              content={
                <>
                  <p>
                    We collect several types of information from and about users of our website, including:
                  </p>
                  <ul>
                    <li>
                      <strong>Personal identifiers</strong>: Such as your name, email address, and contact information.
                    </li>
                    <li>
                      <strong>Technical data</strong>: Such as your IP address, browser type and version, time zone setting, 
                      browser plug-in types, operating system and platform, and other technology on the devices 
                      you use to access this website.
                    </li>
                    <li>
                      <strong>Usage data</strong>: Information about how you use our website, products, and services.
                    </li>
                  </ul>
                  <p>
                    We collect this information:
                  </p>
                  <ul>
                    <li>Directly from you when you provide it to us.</li>
                    <li>Automatically when you browse our website through cookies and similar technologies.</li>
                    <li>From third parties, for example, our business partners.</li>
                  </ul>
                </>
              }
            />
            
            <PolicySection 
              id="information-usage"
              title="How We Use Your Information"
              content={
                <>
                  <p>
                    We use the information that we collect about you or that you provide to us:
                  </p>
                  <ul>
                    <li>To present our website and its contents to you.</li>
                    <li>To provide you with information, products, or services that you request from us.</li>
                    <li>To fulfill any other purpose for which you provide it.</li>
                    <li>To carry out our obligations and enforce our rights.</li>
                    <li>To notify you about changes to our website or products and services.</li>
                    <li>To improve our website, products or services, marketing, or customer relationships.</li>
                    <li>In any other way we may describe when you provide the information.</li>
                    <li>For any other purpose with your consent.</li>
                  </ul>
                </>
              }
            />
            
            <PolicySection 
              id="information-sharing"
              title="Information Sharing"
              content={
                <>
                  <p>
                    We may disclose personal information that we collect or you provide as described in this Privacy Policy:
                  </p>
                  <ul>
                    <li>To our subsidiaries and affiliates.</li>
                    <li>To contractors, service providers, and other third parties we use to support our business.</li>
                    <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, or other sale.</li>
                    <li>To fulfill the purpose for which you provide it.</li>
                    <li>For any other purpose disclosed by us when you provide the information.</li>
                    <li>With your consent.</li>
                  </ul>
                  <p>
                    We may also disclose your personal information:
                  </p>
                  <ul>
                    <li>To comply with any court order, law, or legal process.</li>
                    <li>To enforce or apply our terms of use and other agreements.</li>
                    <li>If we believe disclosure is necessary to protect the rights, property, or safety of BuyTimeApp, our customers, or others.</li>
                  </ul>
                </>
              }
            />
            
            <PolicySection 
              id="data-security"
              title="Data Security"
              content={
                <>
                  <p>
                    We have implemented measures designed to secure your personal information from accidental loss and from 
                    unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers.
                  </p>
                  <p>
                    Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best 
                    to protect your personal information, we cannot guarantee the security of your personal information transmitted 
                    to our website. Any transmission of personal information is at your own risk.
                  </p>
                </>
              }
            />
            
            <PolicySection 
              id="user-rights"
              title="Your Rights"
              content={
                <>
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul>
                    <li>The right to access your personal information.</li>
                    <li>The right to rectify inaccurate personal information.</li>
                    <li>The right to request the deletion of your personal information.</li>
                    <li>The right to restrict the processing of your personal information.</li>
                    <li>The right to data portability.</li>
                    <li>The right to object to the processing of your personal information.</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us using the information provided in the Contact Us section.
                  </p>
                </>
              }
            />
            
            <PolicySection 
              id="children"
              title="Children's Privacy"
              content={
                <>
                  <p>
                    Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
                    information from children under 13. If you are under 13, do not use or provide any information on this 
                    website or register, make any purchases, or provide any information about yourself to us.
                  </p>
                  <p>
                    If we learn we have collected or received personal information from a child under 13 without verification 
                    of parental consent, we will delete that information.
                  </p>
                </>
              }
            />
            
            <PolicySection 
              id="changes"
              title="Changes to Our Privacy Policy"
              content={
                <>
                  <p>
                    We may update our privacy policy from time to time. If we make material changes to how we treat our users' 
                    personal information, we will post the new privacy policy on this page.
                  </p>
                  <p>
                    The date the privacy policy was last revised is identified at the top of the page. You are responsible for 
                    periodically visiting our website and this privacy policy to check for any changes.
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

export default PrivacyPolicy;
