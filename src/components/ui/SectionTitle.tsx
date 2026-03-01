interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
    return (
        <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-dark mb-4">{title}</h2>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4" />
        </div>
    );
};

export default SectionTitle;
