import { NextResponse } from 'next/server';
import { adminAuth, adminDatabase } from '@/lib/firebase-admin';

async function verifyAdmin(idToken: string) {
  if (!idToken) {
    throw new Error('Authentication required');
  }

  // Verify Firebase Auth token
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const uid = decodedToken.uid;

  // Check if user is admin
  const adminRef = adminDatabase.ref(`admins/${uid}`);
  const adminSnapshot = await adminRef.once('value');

  if (!adminSnapshot.exists()) {
    throw new Error('Admin access required');
  }

  return uid;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if this is a fetch request (with idToken) or create request (with skin data)
    if (body.idToken && !body.name) {
      // This is a fetch request
      await verifyAdmin(body.idToken);

      // Fetch all skins from the database
      const skinsRef = adminDatabase.ref('skins');
      const skinsSnapshot = await skinsRef.once('value');
      
      if (!skinsSnapshot.exists()) {
        return NextResponse.json({ 
          success: true, 
          skins: [] 
        });
      }

      const skinsData = skinsSnapshot.val();
      
      // Convert the skins data to an array format
      const skins = [];
      
      for (const [skinId, skinData] of Object.entries(skinsData)) {
        const skin = skinData as any;
        
        skins.push({
          id: skinId,
          name: skin.name || 'Unknown Skin',
          documentName: skin.documentName || skin.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown_skin',
          price: parseInt(skin.price) || 0,
          currency: skin.currency || 'gems',
          tier: skin.tier || 'common',
          imageUrl: skin.imageUrl || '',
          createdAt: skin.createdAt || null,
          updatedAt: skin.updatedAt || null,
        });
      }

      // Sort skins by name for consistent ordering
      skins.sort((a, b) => a.name.localeCompare(b.name));

      return NextResponse.json({ 
        success: true, 
        skins 
      });
    } else {
      // This is a create request
      const { idToken, name, documentName, price, currency, tier, imageUrl } = body;
      
      await verifyAdmin(idToken);
      
      if (!name || !price || !tier) {
        return NextResponse.json(
          { error: 'Missing required fields: name, price, tier' },
          { status: 400 }
        );
      }
      
      const finalDocumentName = documentName || name.toLowerCase().replace(/\s+/g, '_');
      
      // Check if document name already exists
      const skinsRef = adminDatabase.ref('skins');
      const existingRef = skinsRef.child(finalDocumentName);
      const existingSnapshot = await existingRef.once('value');
      
      if (existingSnapshot.exists()) {
        return NextResponse.json(
          { error: `Skin with document name "${finalDocumentName}" already exists` },
          { status: 400 }
        );
      }
      
      const now = new Date().toISOString();
      
      const skinData = {
        name,
        documentName: finalDocumentName,
        price: Number(price),
        currency: currency || 'coins',
        tier,
        imageUrl: imageUrl || '',
        createdAt: now,
        updatedAt: now,
      };
      
      await existingRef.set(skinData);
      
      return NextResponse.json({ 
        success: true,
        skin: {
          id: finalDocumentName,
          ...skinData 
        }
      });
    }

  } catch (error) {
    console.error('Error in skins API:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to process request'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { idToken, id, name, documentName, price, currency, tier, imageUrl } = body;
    
    await verifyAdmin(idToken);
    
    if (!id || !name || !price || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, price, tier' },
        { status: 400 }
      );
    }
    
    const finalDocumentName = documentName || name.toLowerCase().replace(/\s+/g, '_');
    const skinsRef = adminDatabase.ref('skins');
    const currentSkinRef = skinsRef.child(id);
    
    // Get existing data to preserve createdAt
    const currentSnapshot = await currentSkinRef.once('value');
    const currentData = currentSnapshot.val();
    const now = new Date().toISOString();
    
    const skinData = {
      name,
      documentName: finalDocumentName,
      price: Number(price),
      currency: currency || 'coins',
      tier,
      imageUrl: imageUrl || '',
      createdAt: currentData?.createdAt || now, // Preserve existing createdAt or set now if missing
      updatedAt: now,
    };
    
    // If the document name has changed, we need to move the data
    if (id !== finalDocumentName) {
      // Check if new document name already exists
      const newSkinRef = skinsRef.child(finalDocumentName);
      const existingSnapshot = await newSkinRef.once('value');
      
      if (existingSnapshot.exists()) {
        return NextResponse.json(
          { error: `Skin with document name "${finalDocumentName}" already exists` },
          { status: 400 }
        );
      }
      
      // Create new document with new name
      await newSkinRef.set(skinData);
      
      // Delete old document
      await currentSkinRef.remove();
      
      return NextResponse.json({ 
        success: true,
        skin: {
          id: finalDocumentName,
          ...skinData 
        }
      });
    } else {
      // Document name hasn't changed, just update
      await currentSkinRef.update(skinData);
      
      return NextResponse.json({ 
        success: true,
        skin: {
          id,
          ...skinData 
        }
      });
    }
  } catch (error) {
    console.error('Error updating skin:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update skin'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idToken = searchParams.get('idToken');
    
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    await verifyAdmin(idToken);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing skin ID' },
        { status: 400 }
      );
    }
    
    const skinRef = adminDatabase.ref(`skins/${id}`);
    await skinRef.remove();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skin:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete skin'
    }, { status: 500 });
  }
}