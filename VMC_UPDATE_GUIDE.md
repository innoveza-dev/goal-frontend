# VMC (Vision, Mission, Core) System Update Guide

## Overview
The VMC system has been updated to support a new data structure where multiple VMC sets can be stored in a single database record. Each record contains an array of VMC sets, where index 0 represents the main card and indices > 0 represent additional cards.

## Database Structure

### New Data Format
```javascript
{
  id: 1,
  vmcData: [
    {
      vision: [
        { description: "...", visionImageUrl: "..." }
      ],
      mission: [
        { description: "...", missionImageUrl: "..." }
      ],
      core: [
        { title: "...", coreImageUrl: "..." }
      ]
    },
    {
      vision: [
        { description: "...", visionImageUrl: "..." }
      ],
      mission: [
        { description: "...", missionImageUrl: "..." }
      ],
      core: [
        { title: "...", coreImageUrl: "..." }
      ]
    }
  ],
  userId: 1,
  companyId: 1
}
```

## Backend Changes Made

### 1. Controller Updates (`vmcController.js`)

#### Modified Functions:
- **`addVision`**: Now processes `vmcSets` array instead of individual vision/mission/core arrays
- **`getAll`**: Returns data with properly parsed `vmcData` array
- **`updateById`**: Updated to handle set and item indices for specific updates

#### New Functions:
- **`deleteItem`**: Delete individual items from specific sets
- **`deleteSet`**: Delete entire VMC sets

### 2. Routes Updates (`vmcRoutes.js`)
Added new endpoints:
- `DELETE /:id/item` - Delete individual item
- `DELETE /:id/set` - Delete entire set

### 3. New API Structure
The submission now expects:
```javascript
{
  vmcSets: [
    {
      vision: [...],
      mission: [...],
      core: [...]
    }
  ]
}
```

## Frontend Changes Made

### 1. State Management Updates
- Added `vmcSets` state to handle the new structure
- Maintained legacy states for backward compatibility

### 2. Data Fetching Updates
- **`fetchData`**: Now processes and displays VMC sets properly
- Transforms backend response to frontend-friendly format

### 3. Submission Logic Updates
- **`handleSubmitAllVMC`**: Restructured to create VMC sets array
- Main card (index 0) and additional cards (index > 0) are properly organized

### 4. New Functions Added
- **`handleDeleteItem`**: Delete individual vision/mission/core items
- **`handleDeleteSet`**: Delete entire VMC sets
- **`handleEditItem`**: Edit individual items (structure ready, UI pending)

### 5. UI Updates
- Added display section for submitted VMC sets
- Each set shows all its vision, mission, and core items
- Individual delete buttons for each item
- Set-level delete buttons

## New API Helper (`src/api/vmcApi.js`)
Created a comprehensive API helper with methods for:
- `getAll()`: Fetch all VMC records
- `getById(id)`: Fetch specific record
- `create(vmcSetsData, files)`: Create new VMC sets
- `updateItem(id, setIndex, itemIndex, type, data, imageFile)`: Update specific item
- `deleteItem(id, setIndex, itemIndex, type)`: Delete specific item
- `deleteSet(id, setIndex)`: Delete entire set
- `delete(id)`: Delete entire record

## Usage Examples

### Creating VMC Sets
```javascript
const vmcSetsData = [
  {
    vision: [{ description: "Our vision...", imageUrl: "visionImage_0_0" }],
    mission: [{ description: "Our mission...", imageUrl: "missionImage_0_0" }],
    core: [{ title: "Integrity", imageUrl: "coreImage_0_0" }]
  }
];

await vmcApi.create(vmcSetsData, files);
```

### Deleting Individual Items
```javascript
// Delete first vision from main set (setIndex=0, itemIndex=0)
await vmcApi.deleteItem(recordId, 0, 0, 'vision');

// Delete second mission from additional set (setIndex=1, itemIndex=1)
await vmcApi.deleteItem(recordId, 1, 1, 'mission');
```

### Deleting Entire Sets
```javascript
// Delete additional set (setIndex=1)
await vmcApi.deleteSet(recordId, 1);
```

## Key Benefits

1. **Organized Structure**: Main card vs additional cards are clearly separated
2. **Granular Control**: Edit/delete individual items or entire sets
3. **Scalable**: Can add unlimited additional VMC sets
4. **Backward Compatible**: Legacy display still works during transition
5. **Efficient Storage**: Single database record per user/company with multiple sets

## Migration Notes

- Existing data structure is still supported through legacy functions
- New submissions use the VMC sets structure
- Frontend displays both legacy and new format data
- Database should be updated to include `vmcData` column as JSON/TEXT

## Next Steps

1. Implement individual item editing UI
2. Add drag-and-drop reordering for items within sets
3. Add bulk operations (duplicate set, move items between sets)
4. Implement export/import functionality for VMC sets
