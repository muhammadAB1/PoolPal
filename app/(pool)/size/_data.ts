export const POOL_SIZE = {
  heading: 'pool-size-gallons' as const,
  title: 'pool_size_review_title',
  estimatedVolume: {
    value: null as number | null,
    unit: '',
    label: 'pool_size_review_estimated_volume',
    // badge: 'Estimated from dimensions',
    footer: 'pool_size_review_footer',
  },
  detailsTitle: 'pool_size_review_details_title',
  estimationDetails: [
    { label: 'pool_size_units_label', value: '', database_column_name: 'measurement_unit' as const },
    { label: 'pool_size_review_shape', value: '', database_column_name: 'shape' as const },
    { label: 'pool_size_length_label', value: '', database_column_name: 'length' as const },
    { label: 'pool_size_width_label', value: '', database_column_name: 'width' as const },
    { label: 'pool_size_shallow_depth_label', value: '', database_column_name: 'shallow_depth' as const },
    { label: 'pool_size_deep_depth_label', value: '', database_column_name: 'deep_depth' as const },
  ],
  improveBanner: {
    title: 'pool_size_review_improve_title',
    body: 'pool_size_review_improve_body',
    linkText: 'pool_size_review_improve_link',
  },
  infoBanner: {
    title: 'pool_size_review_why_title',
    body: 'pool_size_review_why_body',
  },
};
