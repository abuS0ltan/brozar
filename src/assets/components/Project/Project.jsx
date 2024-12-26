'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Mail, Phone, Globe, Facebook, Instagram } from 'lucide-react'
import { format } from 'date-fns'

interface ProjectDetails {
  id: number
  name: string
  category: string
  description: string
  city: string
  street: string
  owner: {
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
  contact: {
    email: string
    website: string
    whatsapp: string
    phones: string[]
    pages: Array<{
      pageUrl: string
      pageType: string
    }>
  }
  images: string[]
}

interface Comment {
  id: number
  userId: number
  comment: string
  rate: number
  user: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

export default function ProjectDetails({ project }: { project: ProjectDetails }) {
  const [selectedImage, setSelectedImage] = useState('/placeholder.svg?height=400&width=600')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])

  const handleImageClick = (image: string) => {
    setSelectedImage(image)
  }

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleCommentSubmit = async () => {
    // Implement your comment submission logic here
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        comment,
        rate: rating
      })
    })
    
    if (response.ok) {
      setComment('')
      setRating(0)
      // Refresh comments
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={selectedImage}
              alt={project.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {project.images.length > 0 ? (
              project.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(image)}
                  className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md"
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="text-muted-foreground">No images available</div>
            )}
          </div>
        </div>

        {/* Project Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">By</span>
              <span className="font-medium text-primary">
                {project.owner.user.firstName} {project.owner.user.lastName}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary">{project.category}</Badge>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="text-muted-foreground">
              {project.city}, {project.street}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader className="text-lg font-semibold">Contact Information</CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${project.contact.email}`} className="text-primary hover:underline">
                  {project.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${project.contact.phones[0]}`} className="text-primary hover:underline">
                  {project.contact.phones[0]}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <a href={project.contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {project.contact.website}
                </a>
              </div>
              <div className="flex gap-4">
                {project.contact.pages.map((page, index) => (
                  <a
                    key={index}
                    href={page.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    {page.pageType === 'facebook' ? <Facebook className="h-5 w-5" /> : <Instagram className="h-5 w-5" />}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        
        {/* Comment Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleRatingClick(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Textarea
                placeholder="Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={handleCommentSubmit}>Comment</Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {comment.user.firstName[0]}
                      {comment.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {comment.user.firstName} {comment.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(comment.createdAt), 'PP')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            className={`h-4 w-4 ${
                              value <= comment.rate ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2">{comment.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

