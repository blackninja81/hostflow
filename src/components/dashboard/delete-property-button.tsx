'use client'

import { deleteProperty } from '../../app/dashboard/actions'

interface DeleteBtnProps {
  id: string
  thumbnail: string | null
}

export default function DeletePropertyButton({ id, thumbnail }: DeleteBtnProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // Stop any parent links from firing
    if (confirm("Are you sure you want to delete this property? This cannot be undone.")) {
      try {
        await deleteProperty(id, thumbnail)
      } catch (err) {
        alert("Failed to delete property")
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      className="p-2 bg-white shadow-sm border border-gray-100 rounded-full text-gray-400 hover:text-[#FF5A5F] hover:scale-110 transition-all focus:outline-none"
      title="Delete Property"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      </svg>
    </button>
  )
}