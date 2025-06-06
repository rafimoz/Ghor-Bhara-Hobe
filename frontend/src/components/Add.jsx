import { useState, useEffect } from 'react'
import axios from "axios";
import { useParams } from "react-router-dom";

import "./LoadingIndicator.css";

const LoadingIndicator = () => (
    <div className="loading-overlay">
        <div className="loading-spinner"></div>
    </div>
);
import { Plus, X } from "lucide-react";

function Add({ toggleRefreshAds, setAddUnit, ad }) {
    const { id: ownerId } = useParams(); // 👈 get id from URL
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState(ad ? {
        title: ad.title,
        description: ad.description,
        price: ad.price,
        availability: ad.availability,
        moveInDate: ad.moveInDate,
        images: ad.images,
    } : {
        title: "",
        description: "",
        price: 0,
        availability: true,
        moveInDate: "",
        images: [],
    });

    useEffect(() => {
        if (ad) {
            setForm({
                title: ad.title,
                description: ad.description,
                price: ad.price,
                availability: ad.availability,
                moveInDate: ad.moveInDate,
                images: ad.images,
            });
        }
    }, [ad]);

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        console.log("File recived in the state variable ", files);

        if (files.length > 5) {
            alert("You can only upload a maximum of 5 images.");
            return;
        }
        // const readers = [];
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setForm((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), event.target.result],
                }));
            };
            reader.readAsDataURL(files[i]);
        }
    };

    const handleSubmit = async () => {
        console.log("Data being sent to backend:", {
            ...form,
            ownerId,
        });
        const moveInDate = new Date(form.moveInDate);
        let res;
        const data = {
            ...form,
            ownerId,
            moveInDate,
        };
        console.log("Data being sent to updateAd:", data);
        setIsLoading(true);
        try {
            if (ad) {
                res = await axios.put(backendURL + `/api/ads/${ad._id}`, data);
            } else {
                res = await axios.post(backendURL + "/api/ads", data);
            }
            console.log("Response from backend:", res);
            await setForm({ title: "", description: "", price: 0, availability: true, moveInDate: "", images: [] });
            toggleRefreshAds();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sm:max-w-2xl h-fit w-full flex flex-col justify-center rounded-3xl overflow-y-auto shadow-lg dark:shadow-subtitle-dark/20 shadow-subtitle-light/20 dark:bg-card-dark dark:text-title-dark bg-card-light text-title-light space-y-4 transition-all no-scrollbar">
            {isLoading && <LoadingIndicator />}
            {/* Image Preview Section */}
            <div className="relative">
                {form.images.length > 0 && (
                    <img
                        src={form.images[form.images.length - 1]}
                        alt="Main Preview"
                        className="w-full sm:h-65 h-60 object-cover"
                    />
                )}
                <botton onClick={() => setAddUnit(false)} className="absolute z-20 top-4 right-4 dark:bg-subtitle-dark bg-subtitle-light dark:text-bg-dark text-bg-light rounded-full p-1 hover:scale-105 transition-all">
                    <X className="w-8 h-8" />
                </botton>
            </div>
            {/* Thumbnail Section */}
            <div className="flex items-center gap-2 px-4">
                {form.images.slice(0, 3).map((img, index) => (
                    <div
                        key={index}
                        className="relative group w-12 h-12 rounded-xl overflow-hidden border dark:border-subtitle-dark border-subtitle-light"
                    >
                        <img
                            src={img}
                            alt={`thumb-${index}`}
                            className="w-full h-full object-cover"
                        />
                        {/* Delete icon */}
                        <button
                            onClick={() => {
                                setForm((prev) => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index),
                                }));
                            }}
                            className="absolute top-0 right-0 p-0.5 bg-black bg-opacity-60 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {/* Upload New Image Button */}
                <label className="w-12 h-12 border border-dashed dark:border-subtitle-dark border-subtitle-light rounded-xl flex items-center justify-center cursor-pointer dark:text-subtitle-dark text-subtitle-light">
                    <Plus className="w-5 h-5" />
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </label>
            </div>
            <div className="px-4 pb-4 space-y-2 sm:text-lg text-sm">
                {/* Title */}
                <input
                    type="text"
                    placeholder="Single Room"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border dark:border-subtitle-dark border-subtitle-light dark:text-subtitle-dark text-subtitle-light rounded-2xl sm:p-2 p-1 px-2"
                />
                {/* Description */}
                <textarea
                    placeholder="2nd Floor, South faced with open balcony"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full h-fit border dark:border-subtitle-dark border-subtitle-light dark:text-subtitle-dark text-subtitle-light rounded-2xl sm:p-2 p-1 px-2"
                />
                <div className='flex sm:flex-row flex-col justify-between gap-2 mt-0 w-full'>
                    {/* Move-in Date / Status */}
                    <div className="flex items-center gap-2">
                        <h2>Date</h2>
                        <input
                            type="date"
                            placeholder="Available (From 1st April)"
                            value={form.moveInDate}
                            onChange={(e) => setForm({ ...form, moveInDate: e.target.value })}
                            className="w-full border dark:border-subtitle-dark border-subtitle-light dark:text-subtitle-dark text-subtitle-light rounded-2xl sm:p-2 p-1 px-2"
                        />
                    </div>
                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <h2>Price</h2>
                        <input
                            type="number"
                            placeholder="5000৳"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full border dark:border-subtitle-dark border-subtitle-light dark:text-subtitle-dark text-subtitle-light rounded-2xl sm:p-2 p-1 px-2"
                        />
                    </div>
                </div>
                {/* Status */}
                <div className="flex items-center gap-2">
                    <h2>Status</h2>
                    <select
                        value={form.availability ? "available" : "unavailable"}
                        onChange={(e) =>
                            setForm({ ...form, availability: e.target.value === "available" })
                        }
                        className="w-full border dark:border-subtitle-dark border-subtitle-light dark:text-subtitle-dark text-subtitle-light rounded-2xl sm:p-2 p-1 px-2"
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>
                {/* Upload Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full dark:bg-subtitle-dark bg-subtitle-light dark:text-card-dark text-card-light font-medium mt-1 py-2 rounded-3xl dark:hover:bg-description-dark hover:bg-title-light transition"
                >
                    {ad ? "Update" : "Upload"}
                </button>
            </div>
        </div>
    )
}

export default Add
