import InquiryForm from './InquiryFrom';
import { sendOperationsInquiry } from '@/actions/contact';

const MediaContactForm = () => {
  return (
    <InquiryForm
      inquiryType="media"
      title="OPERATIONS INQUIRY"
      onSubmit={sendOperationsInquiry}
    />
  );
};

export default MediaContactForm;