/* eslint-disable no-useless-catch */
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
  getCountFromServer,
} from 'firebase/firestore'
import { db } from '../config'

export const firebaseAddReview = async (userId, coffeeId, score) => {
  try {
    // Validate score is between 1 and 10
    if (score < 1 || score > 10 || !Number.isInteger(score)) {
      throw new Error('Score must be a whole number between 1 and 10')
    }

    const reviewId = `${userId}_${coffeeId}`
    const reviewRef = doc(db, 'reviews', reviewId)
    const coffeeRef = doc(db, 'coffee', coffeeId)

    const existingReview = await getDoc(reviewRef)
    const oldScore = existingReview.exists ? existingReview.data()?.score : null
    const review = { user_id: userId, coffee_id: coffeeId, score, created_at: new Date().toISOString() }

    await setDoc(reviewRef, review)

    // Update coffee document
    const coffeeDoc = await getDoc(coffeeRef)
    const coffeeData = coffeeDoc.data()

    // we also need to update the average score and review count - this would ideally be done with a cloud function
    // but I am cheaap and not paying for that right now
    let newAverage = score
    let newCount = 1

    if (coffeeData) {
      const currentAverage = coffeeData.average_score ?? null
      const currentCount = coffeeData.review_count || 0

      if (oldScore !== null) {
        // Updating existing review - count stays the same
        newCount = currentCount
        newAverage = (currentAverage * currentCount - oldScore + score) / currentCount
      } else {
        // New review - increment count
        newCount = currentCount + 1
        // If this is the first review (currentCount is 0), just use the score
        newAverage = currentCount === 0 ? score : (currentAverage * currentCount + score) / newCount
      }
    } else {
      // First review for this coffee - initialize with this score
      newCount = 1
      newAverage = score
    }

    // Ensure we never have negative counts or NaN averages
    newCount = Math.max(1, newCount)
    newAverage = isNaN(newAverage) ? score : Math.max(1, Math.min(10, newAverage))

    await updateDoc(coffeeRef, { average_score: newAverage, review_count: newCount })

    return { review, newAverage }
  } catch (error) {
    throw error
  }
}

export const firebaseRemoveReview = async (userId, coffeeId) => {
  try {
    const reviewId = `${userId}_${coffeeId}`
    const reviewRef = doc(db, 'reviews', reviewId)
    const coffeeRef = doc(db, 'coffee', coffeeId)

    const reviewDoc = await getDoc(reviewRef)

    if (!reviewDoc.exists) throw new Error('Review not found')

    const reviewScore = reviewDoc.data().score

    const coffeeDoc = await getDoc(coffeeRef)
    const coffeeData = coffeeDoc.data()

    if (coffeeData) {
      const currentAverage = coffeeData.average_score ?? null
      const currentCount = coffeeData.review_count || 0

      let newCount = Math.max(0, currentCount - 1)
      let newAverage = null // Changed from 0 to null when no reviews left

      if (newCount > 0) {
        newAverage = (currentAverage * currentCount - reviewScore) / newCount
        // Ensure average is valid and within bounds
        newAverage = isNaN(newAverage) ? null : Math.max(0, Math.min(10, newAverage))
      }

      await updateDoc(coffeeRef, { average_score: newAverage, review_count: newCount })
    }

    await deleteDoc(reviewRef)

    return { success: true }
  } catch (error) {
    throw error
  }
}

export const firebaseFetchReviews = async (userId, pageSize = 50, lastReviewDoc = null) => {
  try {
    let reviewsQuery = query(
      collection(db, 'reviews'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(pageSize),
    )

    if (lastReviewDoc) {
      reviewsQuery = query(
        collection(db, 'reviews'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
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
      const coffeeRef = doc(db, 'coffee', review.coffee_id)
      const coffeeDoc = await getDoc(coffeeRef)

      if (coffeeDoc.exists) {
        const coffeeData = coffeeDoc.data()
        reviews.push({
          ...review,
          coffee: {
            id: review.coffee_id,
            name: coffeeData.name,
            average_score: coffeeData.average_score,
            review_count: coffeeData.review_count,
          },
        })
      }
    }

    return { reviews, lastDoc, hasMore: reviewsSnapshot.docs.length === pageSize }
  } catch (error) {
    throw error
  }
}

export const firebaseFetchReview = async (userId, coffeeId) => {
  try {
    const reviewId = `${userId}_${coffeeId}`
    const reviewRef = doc(db, 'reviews', reviewId)
    const reviewDoc = await getDoc(reviewRef)

    if (!reviewDoc.exists) return null

    return reviewDoc.data()
  } catch (error) {
    throw error
  }
}

export const firebaseFetchReviewCount = async (userId, coffeeId) => {
  try {
    const reviewRef = collection(db, 'reviews')
    const reviewSnap = await getCountFromServer(reviewRef)

    return reviewSnap.data().count
  } catch (error) {
    throw error
  }
}
