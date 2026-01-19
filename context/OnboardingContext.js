import React, { createContext, useState, useContext } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [onboardingData, setOnboardingData] = useState({
        name: '',
        hearAboutUs: '',
        gender: '',
        birthday: new Date(),
        brands: [],
        goals: [],
        biggestIssue: '',
        confidence: '',
        orderAction: '',
        userImage: null,
        styles: [], // If any screen collects it
    });

    const updateOnboardingData = (newData) => {
        setOnboardingData(prev => ({ ...prev, ...newData }));
    };

    return (
        <OnboardingContext.Provider value={{ onboardingData, updateOnboardingData }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
