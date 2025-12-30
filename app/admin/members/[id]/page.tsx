"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getMemberById } from "@/actions/member";

export default function MemberDetails() {
    const params = useParams();
    const id = params.id as string;
    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            setLoading(true);
            try {
                const response = await getMemberById(id);
                console.log(11, response);

                if (response) {
                    setMember({
                        _id: response.id,
                        ...response.data,
                        createdAt: response.createdAt,
                        updatedAt: response.updatedAt,
                    });

                } else {
                    toast.error("Member not found");
                }
            } catch (error) {
                console.error("Error fetching member:", error);
                toast.error("Failed to load member details");
            } finally {

                setLoading(false);
            }
        };

        if (id) {
            fetchMember();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MM/dd/yyyy");
        } catch (error) {
            return "Invalid date";
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#C5A464] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="p-6">
                <div className="text-center py-20">
                    <h3 className="text-lg font-medium text-gray-500">Member not found</h3>
                    <Link href="/admin/members">
                        <Button variant="outline" className="mt-4">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Members
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Toaster position="top-right" />
            <div className="flex items-center mb-8">
                <Link href="/admin/members">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold ml-4">Member Details</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row">
                    {/* Profile image section */}
                    <div className="md:w-1/3 mb-6 md:mb-0">
                        <div className="flex flex-col items-center">
                            {member.profilePhoto ? (
                                <img
                                    src={member.profilePhoto}
                                    alt={`${member.firstName} ${member.lastName}`}
                                    className="w-48 h-48 object-cover rounded-lg shadow-md"
                                />
                            ) : (
                                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500 text-lg">No Photo</span>
                                </div>
                            )}
                            <div className="mt-4 text-center">
                                <h2 className="text-2xl font-bold">{member.firstName} {member.lastName}</h2>
                                <div className="mt-2">
                                    {member.isActive ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                                    ) : (
                                        <Badge variant="outline">Inactive</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Member details section */}
                    <div className="md:w-2/3 md:pl-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-500 mb-2">Personal Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Date of Birth:</span> {formatDate(member.dateOfBirth)}</p>
                                    <p><span className="font-medium">Age:</span> {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()}</p>
                                    <p><span className="font-medium">Gender:</span> {member.gender}</p>
                                    <p><span className="font-medium">Contact Email:</span> {member.email || 'N/A'}</p>
                                    <p><span className="font-medium">Contact Phone:</span> {member.cellPhone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-500 mb-2">Parent Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Name:</span> {member.parentFirstName || ''} {member.parentLastName || ''}</p>
                                    <p><span className="font-medium">Relationship:</span> {member.relationship || 'N/A'}</p>
                                    <p><span className="font-medium">Country:</span> {member.country || 'N/A'}</p>
                                    <p><span className="font-medium">Address:</span> {member.address || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-500 mb-2">Player Profile</h3>
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">Height:</span> {member.heightFeet || 'N/A'} ft {member.heightInches || 'N/A'} in
                                    </p>
                                    <p>
                                        <span className="font-medium">Weight:</span> {member.weight || 'N/A'} lbs
                                    </p>
                                    <p>
                                        <span className="font-medium">Prior Seasons Played:</span> {member.priorSeasons || '0'}
                                    </p>
                                    <p>
                                        <span className="font-medium">Player Rank:</span> {member.playerRank || 'Unranked'}
                                    </p>
                                    <p>
                                        <span className="font-medium">School Name:</span> {member.schoolName || 'Not Provided'}
                                    </p>
                                </div>

                            </div>

                            {member.emergencyContact && (
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-500 mb-2">Emergency Contact</h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Name:</span> {member.emergencyContact || 'N/A'}</p>
                                        <p><span className="font-medium">Phone:</span> {member.emergencyPhone || 'N/A'}</p>
                                        <p><span className="font-medium">Medical Hospital Phone:</span> {member.medicalHospitalPhone || 'N/A'}</p>

                                    </div>
                                </div>
                            )}

                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-500 mb-2">System Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Member ID:</span> {member._id}</p>
                                    <p><span className="font-medium">Created On:</span> {formatDate(member.createdAt)}</p>
                                    <p><span className="font-medium">Last Updated:</span> {formatDate(member.updatedAt)}</p>
                                </div>
                            </div>
                        </div>

                        {member.birthCertificate && (
                            <div className="mt-6 border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-500 mb-2">Birth Certificate</h3>
                                <a
                                    href={member.birthCertificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#BD9B58] hover:underline flex items-center"
                                >
                                    View Birth Certificate Document
                                </a>
                            </div>
                        )}

                        {member.notes && (
                            <div className="mt-6 border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-500 mb-2">Notes</h3>
                                <p className="text-gray-700 whitespace-pre-line">{member.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 