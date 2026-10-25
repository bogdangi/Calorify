// Maps output indices of onnx-community/mobilenet_v2_1.0_224 (1001 logits:
// index 0 = background, then ImageNet-1k order per its config.id2label) to
// nutrition-database ids. Classes without a nutrition entry are dropped by
// the head, so only mapped indices matter here.
//
// ponytail: mango is not an ImageNet-1k class — mango stays unreachable for
// photo recognition. Upgrade path: zero-shot CLIP head as a third ensemble
// member (label space = nutrition db, no retraining).
export const IMAGENET_TO_FOOD: Record<number, { label: string; foodId: string }> = {
  392: { label: 'coho salmon', foodId: 'salmon' },
  925: { label: 'guacamole', foodId: 'avocado' },
  929: { label: 'ice cream', foodId: 'ice_cream' },
  931: { label: 'French loaf', foodId: 'bread' },
  932: { label: 'bagel', foodId: 'bread' },
  933: { label: 'pretzel', foodId: 'bread' },
  934: { label: 'cheeseburger', foodId: 'hamburger' },
  935: { label: 'hotdog', foodId: 'hot_dog' },
  937: { label: 'head cabbage', foodId: 'salad' },
  938: { label: 'broccoli', foodId: 'broccoli' },
  949: { label: 'Granny Smith', foodId: 'apple' },
  951: { label: 'orange', foodId: 'orange' },
  955: { label: 'banana', foodId: 'banana' },
  960: { label: 'carbonara', foodId: 'spaghetti_carbonara' },
  961: { label: 'chocolate sauce', foodId: 'chocolate' },
  964: { label: 'pizza', foodId: 'pizza' },
};
