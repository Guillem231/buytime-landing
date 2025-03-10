import React, { useRef } from 'react';
import SectionTitle from './components/SectionTitle';
import BuyerCard from './components/BuyerCard';
import SellerCard from './components/SellerCard';
import useScrollAnimations from './hooks/useScrollAnimations';
import styles from './styles/Future.module.css';

const FutureSection = () => {
  const sectionRef = useRef(null);
  const { isVisible } = useScrollAnimations(sectionRef);
  
  return (
    <section ref={sectionRef} className={styles.section}>
      <SectionTitle />
      
      <div className={styles.transactionContainer}>
        <BuyerCard isVisible={isVisible} />
        <SellerCard isVisible={isVisible} />
      </div>
    </section>
  );
};

export default FutureSection;
