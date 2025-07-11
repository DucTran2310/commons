import { FiType, FiImage, FiAlertCircle, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';

export const IconRenderer = ({ icon }: { icon?: string }) => {
  const iconStyle = {
    color: 'inherit', // Kế thừa màu từ node cha
    fontSize: '1.2em',
    verticalAlign: 'middle'
  };

  switch(icon) {
    case 'idea': return <FiAlertCircle style={iconStyle} />;
    case 'task': return <FiCheckCircle style={iconStyle} />;
    case 'question': return <FiHelpCircle style={iconStyle} />;
    case 'image': return <FiImage style={iconStyle} />;
    case 'text': return <FiType style={iconStyle} />;
    default: return null;
  }
};