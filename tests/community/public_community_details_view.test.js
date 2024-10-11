const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

describe('public_community_detail_view function', () => {
  let communityId;

  beforeAll(async () => {
    // Busca um ID de comunidade disponível na base
    const { data, error } = await supabase
      .from('public_community_detail_view')
      .select('id')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);

    communityId = data[0].id; // Atribui o ID da primeira comunidade encontrada
  });

  it('should return community details with associated startups and technologies', async () => {
    const { data, error } = await supabase
      .from('public_community_detail_view')
      .select('*')
      .eq('id', communityId);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);

    const community = data[0];
    
    // Verifica campos da comunidade
    expect(community).toHaveProperty('id');
    expect(community).toHaveProperty('name');
    expect(community).toHaveProperty('description');
    expect(community).toHaveProperty('uf');
    expect(community).toHaveProperty('city');
    expect(community).toHaveProperty('operating_segment_primary_title');
    expect(community).toHaveProperty('operating_segment_secondary_title');
    expect(community).toHaveProperty('technologies_name_list');
    
    // Verifica startups como array de objetos
    expect(Array.isArray(community.startups)).toBe(true);
    community.startups.forEach((startup) => {
      expect(startup).toHaveProperty('startup_name');
      expect(startup).toHaveProperty('startup_logo');
    });

    // Verifica se a lista de tecnologias é um array
    const technologiesList = community.technologies_name_list;
    expect(Array.isArray(technologiesList)).toBe(true);
  });

  it('should return a result even if no startups or technologies are associated', async () => {
    const { data, error } = await supabase
      .from('public_community_detail_view')
      .select('*')
      .eq('id', communityId);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
  });
});
