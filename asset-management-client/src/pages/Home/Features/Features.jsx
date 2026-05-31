import {
  FaLaptop,
  FaUsers,
  FaShieldAlt,
  FaChartPie
} from "react-icons/fa";
import IconCard from '../../../compoments/IconCard/IconCard'

const Features = () => {
  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose AssetVerse
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <IconCard
            icon={FaLaptop}
            title="Asset Tracking"
            description="Track laptops, devices, and equipment in real time."
          />

          <IconCard
            icon={FaUsers}
            title="Employee Management"
            description="Manage employees across multiple companies."
          />

          <IconCard
            icon={FaShieldAlt}
            title="Secure System"
            description="Role-based access with JWT authentication."
          />

          <IconCard
            icon={FaChartPie}
            title="Analytics"
            description="Visual insights into asset usage and requests."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;

