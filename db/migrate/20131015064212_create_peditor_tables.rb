class CreatePeditorTables < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :name
      t.text :content
      t.timestamps
    end
    
    create_table :photos do |t|
    
	  t.string :image
	  
	  t.string :name
	  
	  t.integer :article_id
	  
      t.timestamps
    end
    
  end
end
