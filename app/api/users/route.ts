import { NextRequest, NextResponse } from 'next/server';
import { userModel, CreateUserData } from '@/src/lib/models/User';

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, gender, language, healthGoal } = body;

    // Validation
    if (!name || !age || !gender || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender, language' },
        { status: 400 }
      );
    }

    if (age < 1 || age > 150) {
      return NextResponse.json(
        { error: 'Age must be between 1 and 150' },
        { status: 400 }
      );
    }

    if (!['male', 'female', 'other'].includes(gender)) {
      return NextResponse.json(
        { error: 'Gender must be male, female, or other' },
        { status: 400 }
      );
    }

    const userData: CreateUserData = {
      name: String(name).trim(),
      age: Number(age),
      gender,
      language: String(language).trim(),
      healthGoal: healthGoal ? String(healthGoal).trim() : undefined,
    };

    const user = await userModel.create(userData);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id?.toString(),
          name: user.name,
          age: user.age,
          gender: user.gender,
          language: user.language,
          healthGoal: user.healthGoal,
          onboarded: user.onboarded,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// GET /api/users?id=xxx - Get user by ID
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID parameter' },
        { status: 400 }
      );
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
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
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/users - Update user onboarding status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, onboarded } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    const user = await userModel.setOnboarded(userId, onboarded ?? true);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
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
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
