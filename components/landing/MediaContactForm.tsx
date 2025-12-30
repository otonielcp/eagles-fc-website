import InquiryForm from './InquiryFrom';
import { sendMediaInquiry } from '@/actions/contact';

const MediaContactForm = () => {
  return (
    <InquiryForm
      inquiryType="media"
      title="MEDIA INQUIRY"
      onSubmit={sendMediaInquiry}
    />
  );
};

export default MediaContactForm;