import { NextRequest, NextResponse } from 'next/server';
import { userModel, UpdateUserData } from '@/src/lib/models/User';

// GET /api/profile?userId=xxx - Get user profile
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user._id?.toString(),
        name: user.name,
        age: user.age,
        gender: user.gender,
        language: user.language,
        healthGoal: user.healthGoal,
        onboarded: user.onboarded,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, age, gender, language, healthGoal } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: UpdateUserData = {};

    if (name !== undefined) updateData.name = String(name).trim();
    if (age !== undefined) {
      const ageNum = Number(age);
      if (ageNum < 1 || ageNum > 150) {
        return NextResponse.json(
          { error: 'Age must be between 1 and 150' },
          { status: 400 }
        );
      }
      updateData.age = ageNum;
    }
    if (gender !== undefined) {
      if (!['male', 'female', 'other'].includes(gender)) {
        return NextResponse.json(
          { error: 'Gender must be male, female, or other' },
          { status: 400 }
        );
      }
      updateData.gender = gender;
    }
    if (language !== undefined) updateData.language = String(language).trim();
    if (healthGoal !== undefined)
      updateData.healthGoal = healthGoal ? String(healthGoal).trim() : undefined;

    const user = await userModel.update(userId, updateData);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user._id?.toString(),
        name: user.name,
        age: user.age,
        gender: user.gender,
        language: user.language,
        healthGoal: user.healthGoal,
        onboarded: user.onboarded,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
