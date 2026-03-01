import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import BestSellers from '../components/home/BestSellers';
import StorySection from '../components/home/StorySection';
import WhyChooseUs from '../components/home/WhyChooseUs';

const Home = () => {
    return (
        <div className="overflow-hidden">
            <Hero />
            <FeaturedCategories />
            <BestSellers />
            <StorySection />
            <WhyChooseUs />
        </div>
    );
};

export default Home;
