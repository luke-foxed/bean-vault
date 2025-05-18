import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  limit,
  startAfter,
} from 'firebase/firestore'
import { db } from '../config'

export const createOrUpdateReview = async (userId, coffeeId, score) => {
  if (!userId || !coffeeId || !score) {
    throw new Error('Missing required parameters')
  }

  if (score < 1 || score > 10) {
    throw new Error('Score must be between 1 and 10')
  }

  try {
    const reviewId = `${userId}_${coffeeId}`
    const reviewRef = doc(db, 'reviews', reviewId)
    const coffeeRef = doc(db, 'coffee', coffeeId)

    // Get existing review if any
    const existingReview = await getDoc(reviewRef)
    const oldScore = existingReview.exists ? existingReview.data().score : null

    // Create/update review
    const review = {
      userId,
      coffeeId,
      score,
      createdAt: new Date().toISOString(),
    }

    await setDoc(reviewRef, review)

    // Update coffee document
    const coffeeDoc = await getDoc(coffeeRef)
    const coffeeData = coffeeDoc.data()

    let newAverage = score
    let newCount = 1

    if (coffeeData) {
      const currentAverage = coffeeData.average_score || 0
      const currentCount = coffeeData.review_count || 0

      if (oldScore !== null) {
        // Updating existing review
        newAverage = (currentAverage * currentCount - oldScore + score) / currentCount
        newCount = currentCount
      } else {
        // New review
        newAverage = (currentAverage * currentCount + score) / (currentCount + 1)
        newCount = currentCount + 1
      }
    }

    await updateDoc(coffeeRef, {
      average_score: newAverage,
      review_count: newCount,
    })

    return { review, newAverage }
  } catch (error) {
    console.error('Error adding review:', error)
    throw error
  }
}

export const removeReview = async (userId, coffeeId) => {
  if (!userId || !coffeeId) {
    throw new Error('Missing required parameters')
  }

  try {
    const reviewId = `${userId}_${coffeeId}`
    const reviewRef = doc(db, 'reviews', reviewId)
    const coffeeRef = doc(db, 'coffee', coffeeId)

    // Get the review to be deleted
    const reviewDoc = await getDoc(reviewRef)
    if (!reviewDoc.exists) {
      throw new Error('Review not found')
    }

    const reviewScore = reviewDoc.data().score

    // Get coffee document
    const coffeeDoc = await getDoc(coffeeRef)
    const coffeeData = coffeeDoc.data()

    if (coffeeData) {
      const currentAverage = coffeeData.average_score || 0
      const currentCount = coffeeData.review_count || 0

      // Calculate new average and count
      let newAverage = 0
      let newCount = currentCount - 1

      if (newCount > 0) {
        newAverage = (currentAverage * currentCount - reviewScore) / newCount
      }

      // Update coffee document
      await updateDoc(coffeeRef, {
        average_score: newAverage,
        review_count: newCount,
      })
    }

    // Delete the review
    await deleteDoc(reviewRef)

    return { success: true }
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}

export const fetchUserReviews = async (userId, pageSize = 10, lastReviewDoc = null) => {
  if (!userId) {
    throw new Error('User ID is required')
  }

  try {
    let reviewsQuery = query(
      collection(db, 'reviews'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(pageSize),
    )

    if (lastReviewDoc) {
      reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        startAfter(lastReviewDoc),
        limit(pageSize),
      )
    }

    const reviewsSnapshot = await getDocs(reviewsQuery)
    const reviews = []
    const lastDoc = reviewsSnapshot.docs[reviewsSnapshot.docs.length - 1]

    // Get coffee details for each review
    for (const reviewDoc of reviewsSnapshot.docs) {
      const review = reviewDoc.data()
      const coffeeRef = doc(db, 'coffee', review.coffeeId)
      const coffeeDoc = await getDoc(coffeeRef)

      if (coffeeDoc.exists) {
        const coffeeData = coffeeDoc.data()
        reviews.push({
          ...review,
          coffee: {
            id: review.coffeeId,
            name: coffeeData.name,
            average_score: coffeeData.average_score,
            review_count: coffeeData.review_count,
          },
        })
      }
    }

    return {
      reviews,
      lastDoc,
      hasMore: reviewsSnapshot.docs.length === pageSize,
    }
  } catch (error) {
    console.error('Error getting user reviews:', error)
    throw error
  }
}

export const fetchCoffeeDetails = async (coffeeId) => {
  if (!coffeeId) {
    throw new Error('Coffee ID is required')
  }

  try {
    const coffeeRef = doc(db, 'coffee', coffeeId)
    const coffeeDoc = await getDoc(coffeeRef)

    if (!coffeeDoc.exists) {
      throw new Error('Coffee not found')
    }

    return coffeeDoc.data()
  } catch (error) {
    console.error('Error getting coffee details:', error)
    throw error
  }
}

export const fetchUserReviewForCoffee = async (userId, coffeeId) => {

  console.log('userId', userId)
  console.log('coffeeId', coffeeId)

  if (!userId || !coffeeId) {
    throw new Error('Missing required parameters')
  }

  try {
    const reviewId = `${userId}_${coffeeId}`
    const reviewRef = doc(db, 'reviews', reviewId)
    const reviewDoc = await getDoc(reviewRef)

    if (!reviewDoc.exists) {
      return null
    }

    return reviewDoc.data()
  } catch (error) {
    console.error('Error getting user review:', error)
    throw error
  }
}
