import InquiryForm from './InquiryFrom';
import { sendMarketingInquiry } from '@/actions/contact';

const MediaContactForm = () => {
  return (
    <InquiryForm
      inquiryType="media"
      title="MARKETING INQUIRY"
      onSubmit={sendMarketingInquiry}
    />
  );
};

export default MediaContactForm;