require 'test_helper'

class ArticleTest < ActiveSupport::TestCase
   test "the truth" do
     assert true
   end

   def test_assert
    assert false, "this test returns false"
   end

end
