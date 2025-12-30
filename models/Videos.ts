import mongoose from "mongoose";

interface IVideo extends Document {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    isActive: boolean;
}

const VideoSchema = new mongoose.Schema<IVideo>({
    title: {
        type: String,
        required: [true, "Please provide a title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
        trim: true,
    },
    videoUrl: {
        type: String,
        required: [true, "Please provide a video URL"],
        trim: true,
    },
    thumbnailUrl: {
        type: String,
        required: [true, "Please provide a thumbnail URL"],
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);

export default Video;



